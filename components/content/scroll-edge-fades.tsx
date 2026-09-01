"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getScrollEdgeVisibility } from "@/lib/content/scroll-edge-fade";
import { cn } from "@/lib/utils";

type ScrollAxis = "horizontal" | "vertical";

interface ScrollEdgeFadesProps {
  children: ReactNode;
  axis: ScrollAxis;
  className?: string;
  viewportClassName?: string;
  startFadeClassName?: string;
  endFadeClassName?: string;
  ariaLabel?: string;
  role?: "region";
  tabIndex?: number;
  style?: CSSProperties;
}

const horizontalStartFade =
  "inset-y-0 left-0 w-10 bg-gradient-to-r from-background via-background/90 to-transparent";
const horizontalEndFade =
  "inset-y-0 right-0 w-10 bg-gradient-to-l from-background via-background/90 to-transparent";
const verticalStartFade =
  "inset-x-0 top-0 h-8 bg-gradient-to-b from-background via-background/90 to-transparent";
const verticalEndFade =
  "inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background via-background/90 to-transparent";

export function ScrollEdgeFades({
  children,
  axis,
  className,
  viewportClassName,
  startFadeClassName,
  endFadeClassName,
  ariaLabel,
  role,
  tabIndex,
  style,
}: ScrollEdgeFadesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState({
    showStart: false,
    showEnd: false,
  });

  const updateVisibility = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nextVisibility = getScrollEdgeVisibility(
      axis === "horizontal"
        ? {
            offset: viewport.scrollLeft,
            scrollSize: viewport.scrollWidth,
            viewportSize: viewport.clientWidth,
          }
        : {
            offset: viewport.scrollTop,
            scrollSize: viewport.scrollHeight,
            viewportSize: viewport.clientHeight,
          },
    );

    setVisibility((currentVisibility) =>
      currentVisibility.showStart === nextVisibility.showStart &&
      currentVisibility.showEnd === nextVisibility.showEnd
        ? currentVisibility
        : nextVisibility,
    );
  }, [axis]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("scroll", updateVisibility, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(updateVisibility);
    resizeObserver?.observe(viewport);
    Array.from(viewport.children).forEach((child) =>
      resizeObserver?.observe(child),
    );

    window.addEventListener("resize", updateVisibility);
    updateVisibility();

    return () => {
      viewport.removeEventListener("scroll", updateVisibility);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateVisibility);
    };
  }, [children, updateVisibility]);

  const isHorizontal = axis === "horizontal";
  const sharedFadeClassName =
    "pointer-events-none absolute z-10 opacity-0 transition-opacity duration-150 motion-reduce:transition-none";

  return (
    <div
      className={cn("relative min-w-0 overflow-hidden", className)}
      data-scroll-fade-axis={axis}
      style={style}
    >
      <div
        ref={viewportRef}
        aria-label={ariaLabel}
        className={cn(
          isHorizontal
            ? "overflow-x-auto overflow-y-hidden overscroll-x-contain"
            : "overflow-x-hidden overflow-y-auto overscroll-y-contain",
          viewportClassName,
        )}
        role={role}
        tabIndex={tabIndex}
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          sharedFadeClassName,
          isHorizontal ? horizontalStartFade : verticalStartFade,
          visibility.showStart && "opacity-100",
          startFadeClassName,
        )}
        data-scroll-fade-edge="start"
        data-visible={visibility.showStart}
      />
      <div
        aria-hidden="true"
        className={cn(
          sharedFadeClassName,
          isHorizontal ? horizontalEndFade : verticalEndFade,
          visibility.showEnd && "opacity-100",
          endFadeClassName,
        )}
        data-scroll-fade-edge="end"
        data-visible={visibility.showEnd}
      />
    </div>
  );
}
