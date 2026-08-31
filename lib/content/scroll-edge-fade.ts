export interface ScrollEdgeMetrics {
  offset: number;
  scrollSize: number;
  viewportSize: number;
}

export interface ScrollEdgeVisibility {
  showStart: boolean;
  showEnd: boolean;
}

const DEFAULT_EDGE_THRESHOLD = 1;

export function getScrollEdgeVisibility(
  { offset, scrollSize, viewportSize }: ScrollEdgeMetrics,
  threshold = DEFAULT_EDGE_THRESHOLD,
): ScrollEdgeVisibility {
  const maxOffset = Math.max(0, scrollSize - viewportSize);
  const clampedOffset = Math.min(maxOffset, Math.max(0, offset));
  const hasOverflow = maxOffset > threshold;

  return {
    showStart: hasOverflow && clampedOffset > threshold,
    showEnd: hasOverflow && clampedOffset < maxOffset - threshold,
  };
}
