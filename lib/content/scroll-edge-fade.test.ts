import assert from "node:assert/strict";
import test from "node:test";

import { getScrollEdgeVisibility } from "./scroll-edge-fade";

test("a non-overflowing viewport has no edge fades", () => {
  assert.deepEqual(
    getScrollEdgeVisibility({
      offset: 0,
      scrollSize: 320,
      viewportSize: 320,
    }),
    { showStart: false, showEnd: false },
  );
});

test("scroll edge fades follow the current scroll progress", () => {
  const baseMetrics = {
    scrollSize: 800,
    viewportSize: 320,
  };

  assert.deepEqual(getScrollEdgeVisibility({ ...baseMetrics, offset: 0 }), {
    showStart: false,
    showEnd: true,
  });
  assert.deepEqual(getScrollEdgeVisibility({ ...baseMetrics, offset: 160 }), {
    showStart: true,
    showEnd: true,
  });
  assert.deepEqual(getScrollEdgeVisibility({ ...baseMetrics, offset: 480 }), {
    showStart: true,
    showEnd: false,
  });
});

test("small rounding and overscroll values do not flash the wrong edge", () => {
  const baseMetrics = {
    scrollSize: 800,
    viewportSize: 320,
  };

  assert.deepEqual(getScrollEdgeVisibility({ ...baseMetrics, offset: -12 }), {
    showStart: false,
    showEnd: true,
  });
  assert.deepEqual(
    getScrollEdgeVisibility({ ...baseMetrics, offset: 479.5 }),
    {
      showStart: true,
      showEnd: false,
    },
  );
  assert.deepEqual(getScrollEdgeVisibility({ ...baseMetrics, offset: 520 }), {
    showStart: true,
    showEnd: false,
  });
});
