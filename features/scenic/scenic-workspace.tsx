"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

import type { ScenicItem } from "@/lib/trip/types";

import { ScenicItemList } from "./scenic-item-list";

const PANEL_EASE = [0.23, 1, 0.32, 1] as const;
const SITE_HEADER_HEIGHT = 56;

type OverlayPhase = "closed" | "opening" | "open" | "closing";
type ViewportRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function readPanelRect(contentHeight = 0): ViewportRect {
  const isMobile = window.innerWidth < 640;
  const inset = isMobile ? 12 : 16;
  const width = isMobile
    ? Math.max(0, window.innerWidth - inset * 2)
    : Math.min(640, Math.max(0, window.innerWidth - inset * 2));
  // Keep the sticky site header outside the panel's visual travel area. The
  // panel can still animate from a card that is above this region, but the
  // header remains the topmost, undisturbed part of the page.
  const availableTop = SITE_HEADER_HEIGHT + inset;
  const availableBottom = Math.max(availableTop, window.innerHeight - inset);
  const maxHeight = Math.max(0, availableBottom - availableTop);
  const height = Math.min(
    maxHeight,
    Math.max(isMobile ? 320 : 360, contentHeight),
  );

  return {
    top: availableTop + Math.max(0, (maxHeight - height) / 2),
    left: Math.max(inset, (window.innerWidth - width) / 2),
    width,
    height,
  };
}

function readElementRect(element: HTMLElement): ViewportRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function ScenicWorkspace({
  dayId,
  items,
  initialSelectedItemId,
}: {
  dayId: string;
  items: ScenicItem[];
  initialSelectedItemId?: string;
}) {
  const instanceId = useId();
  const shouldReduceMotion = useReducedMotion();
  const initialItem = items.find((item) => item.id === initialSelectedItemId);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialItem?.id,
  );
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>(
    initialItem ? "open" : "closed",
  );
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [originRect, setOriginRect] = useState<ViewportRect | null>(null);
  const [returnRect, setReturnRect] = useState<ViewportRect | null>(null);
  const [panelRect, setPanelRect] = useState<ViewportRect | null>(null);
  const [detailContentHeight, setDetailContentHeight] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const panelId = `${instanceId}-scenic-details`;
  const panelTitleId = `${instanceId}-scenic-details-title`;
  const overlayMounted = overlayPhase !== "closed";

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (!overlayMounted) return;

    const updatePanelRect = () => {
      setPanelRect(readPanelRect(detailContentHeight));
    };
    updatePanelRect();
    const frame = window.requestAnimationFrame(updatePanelRect);
    window.addEventListener("resize", updatePanelRect);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePanelRect);
    };
  }, [detailContentHeight, overlayMounted]);

  const syncUrl = useCallback(
    (itemId?: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set("day", dayId);
      if (itemId) params.set("item", itemId);
      else params.delete("item");
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    },
    [dayId],
  );

  const closeDetails = useCallback(
    (restoreFocus = true) => {
      shouldRestoreFocusRef.current = restoreFocus;
      const trigger = triggerRef.current;
      if (trigger) setReturnRect(readElementRect(trigger));
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      setOverlayPhase("closing");
      syncUrl();
      closeTimerRef.current = window.setTimeout(
        () => {
          closeTimerRef.current = null;
          setOverlayPhase("closed");
          if (!shouldRestoreFocusRef.current) return;
          shouldRestoreFocusRef.current = false;
          window.requestAnimationFrame(() =>
            triggerRef.current?.focus({ preventScroll: true }),
          );
        },
        shouldReduceMotion ? 0 : 600,
      );
    },
    [shouldReduceMotion, syncUrl],
  );

  useEffect(() => {
    if (initialSelectedItemId && !initialItem) syncUrl();
  }, [initialItem, initialSelectedItemId, syncUrl]);

  useEffect(() => {
    if (!overlayMounted) return;

    const preventScroll = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Node &&
        document.getElementById(panelId)?.contains(target)
      ) {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeDetails();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDetails, overlayMounted, panelId]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    },
    [],
  );

  function selectItem(itemId: string, trigger: HTMLButtonElement) {
    const nextOriginRect = readElementRect(trigger);
    triggerRef.current = trigger;
    shouldRestoreFocusRef.current = false;
    setOriginRect(nextOriginRect);
    setReturnRect(nextOriginRect);
    setPanelRect(nextOriginRect);
    setDetailContentHeight(0);
    setSelectedId(itemId);
    setOverlayPhase("opening");
    openTimerRef.current = window.setTimeout(
      () => {
        openTimerRef.current = null;
        setOverlayPhase((phase) => (phase === "opening" ? "open" : phase));
      },
      shouldReduceMotion ? 0 : 520,
    );
    syncUrl(itemId);
  }

  return (
    <section className="py-7" aria-labelledby="scenic-workspace-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {dayId} · 按行驶顺序
          </p>
          <h2
            id="scenic-workspace-title"
            className="mt-1 text-2xl font-semibold"
          >
            沿途观景
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            优先看能安全停车的点；连续车览走廊只在乘客侧记录，驾驶员不为拍照临停。
          </p>
        </div>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {items.length} 处
        </span>
      </div>

      <div className="mt-6">
        <ScenicItemList
          items={items}
          activeItemId={overlayMounted ? selectedId : undefined}
          detailsPanelId={panelId}
          selectedDayId={dayId}
          titleId={panelTitleId}
          expandedViewportRect={
            overlayPhase === "closing"
              ? (returnRect ?? originRect ?? panelRect ?? undefined)
              : (panelRect ?? undefined)
          }
          overlayPhase={overlayMounted ? overlayPhase : undefined}
          onClose={closeDetails}
          onContentHeightChange={setDetailContentHeight}
          onSelect={selectItem}
        />
      </div>

      {portalHost && overlayMounted
        ? createPortal(
            <motion.div
              aria-hidden="true"
              className="pointer-events-auto fixed inset-x-0 bottom-0 top-14 z-40 cursor-default bg-black/40"
              onClick={() => closeDetails(false)}
              initial={{ opacity: 0 }}
              animate={{
                opacity: overlayPhase === "closing" ? 0 : 1,
                transition: {
                  duration: shouldReduceMotion
                    ? 0
                    : overlayPhase === "closing"
                      ? 0.18
                      : 0.32,
                  delay:
                    shouldReduceMotion || overlayPhase === "closing" ? 0 : 0.12,
                  ease: PANEL_EASE,
                },
              }}
            />,
            portalHost,
          )
        : null}
    </section>
  );
}
