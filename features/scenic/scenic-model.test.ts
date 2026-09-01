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
  getParkingNavigationTarget,
  resolveSelectedScenicItem,
  type ScenicFilters,
} from "./scenic-model";

const d6Items = getScenicItemsForDay(chuanxiScenicCatalog, "D6");

test("scenic filters combine without changing route order", () => {
  const filters: ScenicFilters = {
    ...defaultScenicFilters,
    priority: "core",
    parking: "P1",
    subject: "snow-mountain",
    direction: "return",
    verification: "needs-review",
  };
  const filtered = filterScenicItems(d6Items, filters);

  assert.deepEqual(
    filtered.map((item) => item.id),
    ["VP-D6-02"],
  );
  assert.deepEqual(
    filtered.map((item) => item.sequence),
    [...filtered].map((item) => item.sequence).sort((a, b) => a - b),
  );
  assert.equal(countActiveScenicFilters(filters), 5);
});

test("direction filtering treats bidirectional items as usable both ways", () => {
  const d4Items = getScenicItemsForDay(chuanxiScenicCatalog, "D4");
  assert.equal(
    filterScenicItems(d4Items, {
      ...defaultScenicFilters,
      direction: "outbound",
    }).length,
    3,
  );
  assert.equal(
    filterScenicItems(d6Items, {
      ...defaultScenicFilters,
      direction: "return",
    }).length,
    d6Items.length,
  );
});

test("available subjects are stable and limited to the selected day", () => {
  const subjects = getAvailableSubjects(
    getScenicItemsForDay(chuanxiScenicCatalog, "D4"),
  );
  assert.deepEqual(subjects, [
    "snow-mountain",
    "grassland",
    "wetland",
    "forest",
    "lake",
    "architecture",
    "culture",
  ]);
});

test("selection keeps a requested stable id and falls back after filtering", () => {
  assert.equal(resolveSelectedScenicItem(d6Items, "VP-D6-02")?.id, "VP-D6-02");
  assert.equal(
    resolveSelectedScenicItem(d6Items, "VP-NOT-FOUND")?.id,
    d6Items[0]?.id,
  );
  assert.equal(resolveSelectedScenicItem([], "VP-D6-02"), undefined);
});

test("parking navigation requires verified exact P0 or P1 data", () => {
  const base = d6Items.find(
    (item): item is Viewpoint => item.id === "VP-D6-02",
  );
  assert.ok(base);
  const eligible = {
    ...base,
    geoRef: {
      kind: "exact" as const,
      lat: 30.1,
      lng: 101.2,
      coordinateSystem: "gcj02" as const,
      mapQuery: "鱼子西观景区域",
      verifiedAt: "2026-09-26",
    },
    parking: {
      ...base.parking,
      level: "P1" as const,
      verificationStatus: "verified" as const,
      parkingNavigationQuery: "鱼子西观景区域 停车场",
    },
  };

  assert.deepEqual(getParkingNavigationTarget(eligible), {
    lat: 30.1,
    lng: 101.2,
    coordinateSystem: "gcj02",
    mapQuery: "鱼子西观景区域 停车场",
  });
  assert.equal(
    getParkingNavigationTarget({
      ...eligible,
      parking: { ...eligible.parking, level: "P2" },
    }),
    undefined,
  );
  assert.equal(
    getParkingNavigationTarget({
      ...eligible,
      parking: {
        ...eligible.parking,
        verificationStatus: "needs-review",
      },
    }),
    undefined,
  );
  assert.equal(getParkingNavigationTarget(base), undefined);
});
