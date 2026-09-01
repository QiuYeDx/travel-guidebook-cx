import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiSources } from "../../data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "../../data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "../../data/trips/2026-chuanxi/viewpoints";
import type { ScenicCatalog } from "./types";
import { assertValidScenicCatalog, validateScenicCatalog } from "./schema";

function cloneCatalog(): ScenicCatalog {
  return structuredClone(chuanxiScenicCatalog);
}

function messagesFor(catalog: ScenicCatalog): string {
  return validateScenicCatalog(catalog, chuanxiTrip, chuanxiSources)
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join("\n");
}

test("the scenic catalog satisfies the data contract", () => {
  assert.deepEqual(
    validateScenicCatalog(chuanxiScenicCatalog, chuanxiTrip, chuanxiSources),
    [],
  );
  assert.equal(
    assertValidScenicCatalog(chuanxiScenicCatalog, chuanxiTrip, chuanxiSources),
    chuanxiScenicCatalog,
  );
});

test("all 30 guidebook ids are migrated in route order", () => {
  assert.deepEqual(
    chuanxiScenicCatalog.items.map((item) => item.id),
    [
      "SC-D1-01",
      "VP-D1-01",
      "SC-D1-02",
      "VP-D1-02",
      "SC-D2-01",
      "VP-D2-01",
      "VP-D2-02",
      "SC-D2-02",
      "VP-D3-01",
      "VP-D3-02",
      "VP-D3-03",
      "SC-D3-01",
      "VP-D3-04",
      "VP-D3-05",
      "VP-D4-01",
      "VP-D4-02",
      "VP-D4-03",
      "VP-D4-04",
      "VP-D5-01",
      "SC-D5-01",
      "SC-D5-02",
      "VP-D5-02",
      "VP-D6-01",
      "SC-D6-01",
      "VP-D6-02",
      "VP-D6-03",
      "VP-D7-01",
      "SC-D7-01",
      "VP-D7-02",
      "SC-D7-02",
    ],
  );
});

test("each day has stable sequence order and no pre-verified parking navigation", () => {
  for (const plan of chuanxiScenicCatalog.dayPlans) {
    const sequences = chuanxiScenicCatalog.items
      .filter((item) => item.dayId === plan.dayId)
      .map((item) => item.sequence);
    assert.deepEqual(
      sequences,
      [...sequences].sort((left, right) => left - right),
    );
  }

  assert.equal(
    chuanxiScenicCatalog.items.some(
      (item) => item.parking.parkingNavigationQuery !== undefined,
    ),
    false,
  );
});

test("D4 is a scenic-transit day and D6 keeps a two-stop ceiling", () => {
  const d4 = chuanxiScenicCatalog.dayPlans.find((item) => item.dayId === "D4");
  const d6 = chuanxiScenicCatalog.dayPlans.find((item) => item.dayId === "D6");
  assert.equal(d4?.mode, "scenic-transit");
  assert.equal(d4?.photoStopBudget, undefined);
  assert.equal(d6?.mode, "road-stops");
  assert.deepEqual(d6?.photoStopBudget, [0, 2]);
  assert.equal(
    chuanxiScenicCatalog.items.filter((item) => item.dayId === "D6").length,
    4,
  );
});

test("P2 and prohibited corridors cannot expose parking navigation", () => {
  const catalog = cloneCatalog();
  const corridor = catalog.items.find((item) => item.id === "SC-D1-01");
  assert.ok(corridor);
  corridor.parking.parkingNavigationQuery = "高速峡谷停车";

  const messages = messagesFor(catalog);
  assert.match(
    messages,
    /prohibited parking must not expose parking navigation/,
  );
  assert.match(messages, /scenic corridors must not expose parking navigation/);
});

test("pending P1 points require exact coordinates and verified parking before navigation", () => {
  const catalog = cloneCatalog();
  const viewpoint = catalog.items.find((item) => item.id === "VP-D6-02");
  assert.ok(viewpoint);
  viewpoint.parking.parkingNavigationQuery = "雅拉雪山观景台停车入口";

  const messages = messagesFor(catalog);
  assert.match(messages, /parking navigation requires an exact geo reference/);
  assert.match(messages, /parking navigation requires verified parking/);
});

test("exact points require an explicit GCJ-02 coordinate contract", () => {
  const catalog = cloneCatalog();
  const viewpoint = catalog.items.find((item) => item.id === "VP-D6-02");
  assert.ok(viewpoint);
  Object.assign(viewpoint, {
    geoRef: {
      kind: "exact",
      lat: 30.1,
      lng: 101.2,
      coordinateSystem: "wgs84",
      mapQuery: "测试入口",
      verifiedAt: "2026-09-20",
    },
  });

  assert.match(messagesFor(catalog), /must be gcj02 for Amap navigation/);
});

test("corridors reject fake point geometry", () => {
  const catalog = cloneCatalog();
  const corridor = catalog.items.find((item) => item.id === "SC-D2-02");
  assert.ok(corridor);
  Object.assign(corridor, {
    geoRef: { kind: "none", reason: "test invalid corridor geometry" },
  });

  assert.match(
    messagesFor(catalog),
    /scenic corridors must use a route-interval geo reference/,
  );
});

test("duplicate sequence values within a day fail validation", () => {
  const catalog = cloneCatalog();
  const first = catalog.items.find((item) => item.id === "SC-D1-01");
  const second = catalog.items.find((item) => item.id === "VP-D1-01");
  assert.ok(first && second);
  second.sequence = first.sequence;

  assert.match(messagesFor(catalog), /duplicate sequence 10 for D1/);
});
