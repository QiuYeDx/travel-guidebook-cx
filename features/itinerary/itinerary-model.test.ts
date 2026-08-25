import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiTrip } from "../../data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "../../data/trips/2026-chuanxi/viewpoints";
import { createAmapSearchUrl } from "../../lib/navigation/map-links";
import {
  buildDayItinerary,
  getScenicItemsForDay,
  getTripDayIds,
} from "./itinerary-model";

test("all trip days can build stable previous and next navigation", () => {
  const ids = getTripDayIds(chuanxiTrip);
  assert.deepEqual(ids, [
    "D0",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "D6",
    "D7",
    "D8",
    "D9",
  ]);

  for (const [index, id] of ids.entries()) {
    const itinerary = buildDayItinerary(chuanxiTrip, chuanxiScenicCatalog, id);
    assert.ok(itinerary);
    assert.equal(itinerary.day.primaryGoal.length > 0, true);
    assert.equal(itinerary.previousDay?.id, ids[index - 1]);
    assert.equal(itinerary.nextDay?.id, ids[index + 1]);
  }
});

test("D5 reuses D3 candidates and keeps the two-stop budget", () => {
  const d5 = buildDayItinerary(chuanxiTrip, chuanxiScenicCatalog, "D5");
  assert.ok(d5);
  assert.equal(d5.scenicPlan?.mode, "reuse");
  assert.equal(d5.parkingBudgetLabel, "最多 2 次");
  assert.equal(d5.scenicItems.length, 4);
  assert.ok(d5.scenicItems.every((item) => item.dayId === "D3"));
  assert.ok(d5.degradeAction?.includes("其余候选自动改为车览"));
});

test("D3, D5, and D9 expose parking budgets and downgrade actions", () => {
  for (const dayId of ["D3", "D5", "D9"]) {
    const itinerary = buildDayItinerary(
      chuanxiTrip,
      chuanxiScenicCatalog,
      dayId,
    );
    assert.ok(itinerary);
    assert.match(itinerary.parkingBudgetLabel, /最多/);
    assert.ok(itinerary.degradeAction);
  }
});

test("scenic items stay in route order", () => {
  const items = getScenicItemsForDay(chuanxiScenicCatalog, "D6");
  assert.ok(items.length > 0);
  for (let index = 1; index < items.length; index += 1) {
    assert.ok(items[index - 1].sequence < items[index].sequence);
  }
});

test("map search links encode the public route query", () => {
  const url = new URL(createAmapSearchUrl("成都 → 泸定 → 康定"));
  assert.equal(url.origin, "https://uri.amap.com");
  assert.equal(url.pathname, "/search");
  assert.equal(url.searchParams.get("keyword"), "成都 → 泸定 → 康定");
  assert.equal(url.searchParams.get("callnative"), "1");
  assert.throws(() => createAmapSearchUrl("  "));
});
