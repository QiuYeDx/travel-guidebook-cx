"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ParkingLevel, ScenicItem, Viewpoint } from "@/lib/trip/types";
import { cn } from "@/lib/utils";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import {
  scenicKindLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
} from "./scenic-labels";
import { isScenicCorridor } from "./scenic-model";
import { ScenicDetailPanel } from "./scenic-detail-panel";
import { ScenicSubjectTag } from "./scenic-subject-tag";

const CARD_TRANSITION = {
  type: "spring" as const,
  duration: 0.48,
  bounce: 0,
};
const CARD_EASE = [0.23, 1, 0.32, 1] as const;

export type ScenicVisualRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ScenicItemListProps = {
  items: ScenicItem[];
  activeItemId?: string;
  detailsPanelId: string;
  titleId: string;
  expandedViewportRect?: ScenicVisualRect;
  overlayPhase?: "opening" | "open" | "closing";
  onClose: (restoreFocus?: boolean) => void;
  onContentHeightChange: (height: number) => void;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
};

function ScenicCardHeader({
  item,
  index,
  layoutPrefix,
  fadeNonShared = false,
  shouldReduceMotion = false,
}: {
  item: ScenicItem;
  index: number;
  layoutPrefix?: string;
  fadeNonShared?: boolean;
  shouldReduceMotion?: boolean | null;
}) {
  const corridor = isScenicCorridor(item);
  const Icon = corridor ? RouteIcon : kindIcons[item.kind];

  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {layoutPrefix ? (
            <motion.span
              layoutId={`${layoutPrefix}-index`}
              layoutCrossfade={false}
              transition={CARD_TRANSITION}
              className="font-mono text-xs font-medium tabular-nums text-muted-foreground"
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
          ) : (
            <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          {layoutPrefix ? (
            <motion.span
              layoutId={`${layoutPrefix}-kind`}
              layoutCrossfade={false}
              transition={CARD_TRANSITION}
              className="inline-flex"
            >
              <Badge variant="outline">
                {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
              </Badge>
            </motion.span>
          ) : (
            <Badge variant="outline">
              {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
            </Badge>
          )}
          {layoutPrefix ? (
            <motion.span
              layoutId={`${layoutPrefix}-priority`}
              layoutCrossfade={false}
              transition={CARD_TRANSITION}
              className="inline-flex"
            >
              <Badge
                variant={item.priority === "core" ? "default" : "secondary"}
                className={
                  item.priority === "core"
                    ? "bg-emerald-700 text-white hover:bg-emerald-700"
                    : undefined
                }
              >
                {scenicPriorityLabels[item.priority]}
              </Badge>
            </motion.span>
          ) : (
            <Badge
              variant={item.priority === "core" ? "default" : "secondary"}
              className={
                item.priority === "core"
                  ? "bg-emerald-700 text-white hover:bg-emerald-700"
                  : undefined
              }
            >
              {scenicPriorityLabels[item.priority]}
            </Badge>
          )}
        </div>
        {layoutPrefix ? (
          <motion.h3
            layoutId={`${layoutPrefix}-title`}
            layoutCrossfade={false}
            transition={CARD_TRANSITION}
            className="mt-2 text-lg font-semibold leading-7 sm:text-xl"
          >
            {item.title}
          </motion.h3>
        ) : (
          <h3 className="mt-2 text-lg font-semibold leading-7 sm:text-xl">
            {item.title}
          </h3>
        )}
      </div>
      <motion.span
        initial={false}
        animate={{ opacity: fadeNonShared ? 0 : 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.18,
          ease: CARD_EASE,
        }}
        className="shrink-0"
      >
        <Icon
          className="size-6 text-foreground/80 dark:text-foreground/75"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </motion.span>
    </div>
  );
}

function ScenicCardBody({
  item,
  fadeNonShared = false,
  shouldReduceMotion = false,
}: {
  item: ScenicItem;
  fadeNonShared?: boolean;
  shouldReduceMotion?: boolean | null;
}) {
  const corridor = isScenicCorridor(item);
  const ParkingIcon =
    item.parking.level === "P0" ? ShieldCheckIcon : ShieldAlertIcon;

  return (
    <div className="min-w-0">
      <motion.p
        initial={false}
        animate={{ opacity: fadeNonShared ? 0 : 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: CARD_EASE,
        }}
        className="text-sm leading-6 text-foreground/75"
      >
        {corridor ? item.passengerCue : item.parking.note}
      </motion.p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {item.subjects.slice(0, 4).map((subject) => (
          <ScenicSubjectTag key={subject} subject={subject} />
        ))}
        <motion.span
          initial={false}
          animate={{ opacity: fadeNonShared ? 0 : 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.2,
            ease: CARD_EASE,
          }}
          className={cn(
            "ml-auto inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset",
            parkingToneClasses[item.parking.level],
          )}
        >
          <ParkingIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {scenicParkingLabels[item.parking.level]}
          </span>
        </motion.span>
      </div>
    </div>
  );
}

function ScenicCardContent({
  item,
  index,
  layoutPrefix,
}: {
  item: ScenicItem;
  index: number;
  layoutPrefix?: string;
}) {
  return (
    <>
      <ScenicCardHeader item={item} index={index} layoutPrefix={layoutPrefix} />
      <ScenicCardBody item={item} />
    </>
  );
}

const CARD_CLASS_NAME =
  "flex min-h-44 w-full flex-col gap-3 rounded-2xl border border-border/65 bg-card p-4 text-left shadow-xs sm:p-5";

function ScenicDetailVisual({
  item,
  index,
  phase,
  detailsPanelId,
  titleId,
  onClose,
  onContentHeightChange,
  shouldReduceMotion,
}: {
  item: ScenicItem;
  index: number;
  phase: "opening" | "open" | "closing";
  detailsPanelId: string;
  titleId: string;
  onClose: (restoreFocus?: boolean) => void;
  onContentHeightChange: (height: number) => void;
  shouldReduceMotion: boolean | null;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => onContentHeightChange(content.scrollHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [item.id, onContentHeightChange]);

  return (
    <div
      id={detailsPanelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="pointer-events-auto relative h-full w-full overflow-hidden rounded-2xl"
    >
      <motion.button
        data-scenic-detail-close=""
        type="button"
        onClick={() => onClose()}
        className={cn(
          "absolute right-3 top-3 z-40 flex size-9 cursor-pointer items-center justify-center rounded-md bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          phase === "closing" && "pointer-events-none",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "closing" ? 0 : 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.16,
          ease: CARD_EASE,
        }}
        aria-label="关闭观景详情"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </motion.button>

      <div className="absolute inset-0 z-20 flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl border bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "closing" ? 0 : 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.24,
            delay: shouldReduceMotion || phase !== "opening" ? 0 : 0.04,
            ease: CARD_EASE,
          }}
        />
        <div
          ref={contentRef}
          className="relative z-10 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <ScenicDetailPanel
            item={item}
            index={index}
            titleId={titleId}
            layoutPrefix={`scenic-${item.id}`}
            supportingPhase={phase}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </div>
    </div>
  );
}

function ScenicCardVisual({
  item,
  index,
  fadeBody,
  shouldReduceMotion,
}: {
  item: ScenicItem;
  index: number;
  fadeBody: boolean;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(CARD_CLASS_NAME, "h-full pointer-events-none")}
    >
      <ScenicCardHeader
        item={item}
        index={index}
        layoutPrefix={`scenic-${item.id}`}
        fadeNonShared={fadeBody}
        shouldReduceMotion={shouldReduceMotion}
      />
      <ScenicCardBody
        item={item}
        fadeNonShared={fadeBody}
        shouldReduceMotion={shouldReduceMotion}
      />
    </div>
  );
}

const kindIcons = {
  viewpoint: CameraIcon,
  "scenic-shuttle": BusFrontIcon,
  "town-stop": CarFrontIcon,
  candidate: MapPinIcon,
} satisfies Record<Viewpoint["kind"], typeof CameraIcon>;

const parkingToneClasses = {
  P0: "bg-emerald-50 text-emerald-800 ring-emerald-200/80 dark:bg-emerald-950/55 dark:text-emerald-300 dark:ring-emerald-800/80",
  P1: "bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-950/45 dark:text-amber-300 dark:ring-amber-800/80",
  P2: "bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-950/45 dark:text-amber-300 dark:ring-amber-800/80",
  prohibited:
    "bg-red-50 text-red-700 ring-red-200/80 dark:bg-red-950/45 dark:text-red-300 dark:ring-red-900/80",
  "transit-only":
    "bg-sky-50 text-sky-800 ring-sky-200/80 dark:bg-sky-950/45 dark:text-sky-300 dark:ring-sky-900/80",
  "walk-only": "bg-muted text-foreground/75 ring-border",
} satisfies Record<ParkingLevel, string>;

export function ScenicItemList({
  items,
  activeItemId,
  detailsPanelId,
  titleId,
  expandedViewportRect,
  overlayPhase,
  onClose,
  onContentHeightChange,
  onSelect,
}: ScenicItemListProps) {
  const shouldReduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const scrollFrameRef = useRef<number | null>(null);
  const [listRect, setListRect] = useState<DOMRect | null>(null);
  const [itemRects, setItemRects] = useState(
    new Map<string, ScenicVisualRect>(),
  );
  const expandedTop = expandedViewportRect?.top;
  const expandedLeft = expandedViewportRect?.left;
  const expandedWidth = expandedViewportRect?.width;
  const expandedHeight = expandedViewportRect?.height;

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const nextListRect = list.getBoundingClientRect();
    const nextItemRects = new Map<string, ScenicVisualRect>();
    itemRefs.current.forEach((itemNode, itemId) => {
      const rect = itemNode.getBoundingClientRect();
      nextItemRects.set(itemId, {
        top: rect.top - nextListRect.top,
        left: rect.left - nextListRect.left,
        width: rect.width,
        height: rect.height,
      });
    });
    setListRect(nextListRect);
    setItemRects(nextItemRects);
  }, []);

  useLayoutEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;
    // Scroll does not change the list's size, so ResizeObserver alone cannot
    // refresh its viewport origin. Re-measure after opening state changes to
    // keep viewport-to-list coordinates in sync.
    let secondFrame: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      measure();
      secondFrame = window.requestAnimationFrame(measure);
    });
    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        measure();
      });
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(list);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", handleScroll, true);
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [
    activeItemId,
    expandedHeight,
    expandedLeft,
    expandedTop,
    expandedWidth,
    items,
    measure,
    overlayPhase,
  ]);

  // Read the live viewport origin while rendering. This covers the small
  // scroll that browsers may perform when a clicked button receives focus,
  // before the next scroll event or observer callback gets a chance to run.
  const liveListRect = listRef.current?.getBoundingClientRect();
  const positionedListRect = liveListRect ?? listRect;
  const expandedRect =
    expandedViewportRect && positionedListRect
      ? {
          top: expandedViewportRect.top - positionedListRect.top,
          left: expandedViewportRect.left - positionedListRect.left,
          width: expandedViewportRect.width,
          height: expandedViewportRect.height,
        }
      : undefined;

  return (
    <LayoutGroup id={detailsPanelId}>
      <ol ref={listRef} className="relative grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => {
          const active = item.id === activeItemId;
          const itemRect = itemRects.get(item.id);
          const visualRect = active && expandedRect ? expandedRect : itemRect;
          return (
            <li
              key={item.id}
              id={`scenic-list-${item.id}`}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
              className="h-full min-w-0"
            >
              <button
                type="button"
                aria-controls={detailsPanelId}
                aria-expanded={active}
                onPointerDown={(event) => event.preventDefault()}
                onClick={(event) => onSelect(item.id, event.currentTarget)}
                className={cn(
                  CARD_CLASS_NAME,
                  "cursor-pointer opacity-0 focus-visible:outline-none",
                )}
                aria-label={`打开 ${item.title} 详情`}
              >
                <span aria-hidden="true">
                  <ScenicCardContent item={item} index={index} />
                </span>
              </button>
              {visualRect ? (
                <>
                  {active && overlayPhase ? (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute rounded-2xl bg-black/20 blur-xl"
                      style={{ zIndex: 64 }}
                      initial={{ opacity: 0 }}
                      animate={{
                        ...visualRect,
                        opacity: overlayPhase === "closing" ? 0 : 1,
                      }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              ...CARD_TRANSITION,
                              delay: overlayPhase === "opening" ? 0.04 : 0,
                            }
                      }
                    />
                  ) : null}
                  <motion.div
                    className={cn(
                      "absolute",
                      active ? "pointer-events-auto" : "pointer-events-none",
                    )}
                    style={{ zIndex: active ? 65 : 10 }}
                    initial={false}
                    animate={visualRect}
                    transition={
                      shouldReduceMotion ? { duration: 0 } : CARD_TRANSITION
                    }
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10"
                    >
                      <ScenicCardVisual
                        item={item}
                        index={index}
                        shouldReduceMotion={shouldReduceMotion}
                        fadeBody={Boolean(
                          active && overlayPhase && overlayPhase !== "closing",
                        )}
                      />
                    </div>
                    {active && overlayPhase ? (
                      <ScenicDetailVisual
                        item={item}
                        index={index}
                        phase={overlayPhase}
                        detailsPanelId={detailsPanelId}
                        titleId={titleId}
                        onClose={onClose}
                        onContentHeightChange={onContentHeightChange}
                        shouldReduceMotion={shouldReduceMotion}
                      />
                    ) : null}
                  </motion.div>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </LayoutGroup>
  );
}
