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

test("D6 keeps the three-stop ceiling and route-order scenic items", () => {
  const d6 = buildDayItinerary(chuanxiTrip, chuanxiScenicCatalog, "D6");
  assert.ok(d6);
  assert.equal(d6.scenicPlan?.mode, "road-stops");
  assert.equal(d6.parkingBudgetLabel, "1-3 次");
  assert.equal(d6.scenicItems.length, 8);
  assert.ok(d6.scenicItems.every((item) => item.dayId === "D6"));
  assert.ok(d6.degradeAction?.includes("其余候选自动改为车览"));
});

test("road-stop days expose parking budgets and downgrade actions", () => {
  for (const dayId of ["D3", "D6", "D7"]) {
    const itinerary = buildDayItinerary(
      chuanxiTrip,
      chuanxiScenicCatalog,
      dayId,
    );
    assert.ok(itinerary);
    assert.match(itinerary.parkingBudgetLabel, /次/);
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
  const url = new URL(createAmapSearchUrl("深圳 → 贵阳"));
  assert.equal(url.origin, "https://uri.amap.com");
  assert.equal(url.pathname, "/search");
  assert.equal(url.searchParams.get("keyword"), "深圳 → 贵阳");
  assert.equal(url.searchParams.get("callnative"), "1");
  assert.throws(() => createAmapSearchUrl("  "));
});
