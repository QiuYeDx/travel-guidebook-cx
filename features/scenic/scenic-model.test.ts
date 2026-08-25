import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiScenicCatalog } from "../../data/trips/2026-chuanxi/viewpoints";
import type { Viewpoint } from "../../lib/trip/types";
import { getScenicItemsForDay } from "../itinerary/itinerary-model";
import {
  countActiveScenicFilters,
  defaultScenicFilters,
  filterScenicItems,
  getAvailableSubjects,
  getParkingNavigationQuery,
  resolveSelectedScenicItem,
  type ScenicFilters,
} from "./scenic-model";

const d3Items = getScenicItemsForDay(chuanxiScenicCatalog, "D3");

test("scenic filters combine without changing route order", () => {
  const filters: ScenicFilters = {
    ...defaultScenicFilters,
    priority: "core",
    parking: "P1",
    subject: "mountain",
    direction: "outbound",
    verification: "needs-review",
  };
  const filtered = filterScenicItems(d3Items, filters);

  assert.deepEqual(
    filtered.map((item) => item.id),
    ["VP-D3-01", "VP-D3-06", "VP-D3-07"],
  );
  assert.deepEqual(
    filtered.map((item) => item.sequence),
    [...filtered].map((item) => item.sequence).sort((a, b) => a - b),
  );
  assert.equal(countActiveScenicFilters(filters), 5);
});

test("direction filtering treats bidirectional items as usable both ways", () => {
  const d6Items = getScenicItemsForDay(chuanxiScenicCatalog, "D6");
  assert.equal(
    filterScenicItems(d3Items, {
      ...defaultScenicFilters,
      direction: "return",
    }).length,
    d3Items.length,
  );
  assert.equal(
    filterScenicItems(d6Items, {
      ...defaultScenicFilters,
      direction: "outbound",
    }).length,
    0,
  );
});

test("available subjects are stable and limited to the selected day", () => {
  const subjects = getAvailableSubjects(
    getScenicItemsForDay(chuanxiScenicCatalog, "D4"),
  );
  assert.deepEqual(subjects, [
    "snow-mountain",
    "valley",
    "grassland",
    "forest",
    "lake",
    "architecture",
  ]);
});

test("selection keeps a requested stable id and falls back after filtering", () => {
  assert.equal(resolveSelectedScenicItem(d3Items, "VP-D3-06")?.id, "VP-D3-06");
  assert.equal(
    resolveSelectedScenicItem(d3Items, "VP-NOT-FOUND")?.id,
    d3Items[0]?.id,
  );
  assert.equal(resolveSelectedScenicItem([], "VP-D3-06"), undefined);
});

test("parking navigation requires verified exact P0 or P1 data", () => {
  const base = d3Items.find(
    (item): item is Viewpoint => item.id === "VP-D3-01",
  );
  assert.ok(base);
  const eligible = {
    ...base,
    geoRef: {
      kind: "exact" as const,
      lat: 30.1,
      lng: 101.2,
      mapQuery: "天路十八弯观景台",
      verifiedAt: "2026-09-20",
    },
    parking: {
      ...base.parking,
      level: "P1" as const,
      verificationStatus: "verified" as const,
      parkingNavigationQuery: "天路十八弯观景台 停车场",
    },
  };

  assert.equal(getParkingNavigationQuery(eligible), "天路十八弯观景台 停车场");
  assert.equal(
    getParkingNavigationQuery({
      ...eligible,
      parking: { ...eligible.parking, level: "P2" },
    }),
    undefined,
  );
  assert.equal(
    getParkingNavigationQuery({
      ...eligible,
      parking: {
        ...eligible.parking,
        verificationStatus: "needs-review",
      },
    }),
    undefined,
  );
  assert.equal(getParkingNavigationQuery(base), undefined);
});
