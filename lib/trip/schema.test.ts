import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiSources } from "../../data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "../../data/trips/2026-chuanxi/trip";
import type { SourceRef, Trip } from "./types";
import { assertValidTrip, validateSources, validateTrip } from "./schema";

function cloneTrip(): Trip {
  return structuredClone(chuanxiTrip);
}

test("the 2026 Chuanxi v2 baseline satisfies the data contract", () => {
  assert.deepEqual(validateTrip(chuanxiTrip, chuanxiSources), []);
  assert.equal(assertValidTrip(chuanxiTrip, chuanxiSources), chuanxiTrip);
});

test("the route does not fabricate vehicle-specific arrival state of charge", () => {
  assert.ok(
    chuanxiTrip.days
      .flatMap((day) => day.legs)
      .every((leg) => leg.targetArrivalSoc === undefined),
  );
});

test("dates, route titles, intensity, and overnight places match guidebook v2.0", () => {
  assert.deepEqual(
    chuanxiTrip.days.map(({ id, date, title, intensity, overnight }) => ({
      id,
      date,
      title,
      intensity,
      overnight: overnight.place,
    })),
    [
      {
        id: "D1",
        date: "2026-09-29",
        title: "成都 → 四姑娘山 → 丹巴中路藏寨",
        intensity: "medium",
        overnight: "丹巴中路藏寨",
      },
      {
        id: "D2",
        date: "2026-09-30",
        title: "中路藏寨 → 八美 → 塔公 → 姑弄村 → 新都桥",
        intensity: "low",
        overnight: "新都桥",
      },
      {
        id: "D3",
        date: "2026-10-01",
        title: "新都桥 → 理塘 → 海子山 → 香格里拉镇",
        intensity: "medium-high",
        overnight: "香格里拉镇",
      },
      {
        id: "D4",
        date: "2026-10-02",
        title: "稻城亚丁短线",
        intensity: "low-medium",
        overnight: "香格里拉镇（连住）",
      },
      {
        id: "D5",
        date: "2026-10-03",
        title: "香格里拉镇 → 桑堆 → 理塘 → 雅江",
        intensity: "medium",
        overnight: "雅江县城",
      },
      {
        id: "D6",
        date: "2026-10-04",
        title: "雅江 → 新都桥 → 甲根坝（可选）→ 鱼子西 → 新都桥",
        intensity: "low",
        overnight: "新都桥",
      },
      {
        id: "D7",
        date: "2026-10-05",
        title: "新都桥 → 折多山 → 泸定桥 → 成都",
        intensity: "low",
        overnight: "成都（行程结束）",
      },
    ],
  );
});

test("trip days are continuous from D1 through D7", () => {
  const trip = cloneTrip();
  trip.days[3].date = "2026-10-03";

  assert.match(
    validateTrip(trip, chuanxiSources)
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("\n"),
    /trip\.days\[3\]\.date: expected 2026-10-02/,
  );
});

test("daily timeline and altitude fields reject empty or impossible values", () => {
  const trip = cloneTrip();
  trip.days[0].timeline = [];
  trip.days[1].altitudeProfile.peakM = 1000;

  const messages = validateTrip(trip, chuanxiSources)
    .map((issue) => issue.message)
    .join("\n");
  assert.match(messages, /must not be empty/);
  assert.match(messages, /must not be lower than the start or end altitude/);
});

test("unknown and undeclared source references fail validation", () => {
  const trip = cloneTrip();
  trip.days[0].sourceIds = ["SRC-MISSING"];

  assert.match(
    validateTrip(trip, chuanxiSources)
      .map((issue) => issue.message)
      .join("\n"),
    /unknown source id: SRC-MISSING/,
  );
});

test("invalid route estimates and state-of-charge targets fail validation", () => {
  const trip = cloneTrip();
  const leg = trip.days[1].legs[0];
  leg.distanceKmEstimate = [280, 260];
  leg.targetArrivalSoc = 120;

  const messages = validateTrip(trip, chuanxiSources)
    .map((issue) => issue.message)
    .join("\n");
  assert.match(messages, /non-negative ascending range/);
  assert.match(messages, /between 0 and 100/);
});

test("seasonal and live sources require a future review checkpoint", () => {
  const sources: SourceRef[] = [
    {
      id: "SRC-SEASONAL",
      title: "Seasonal source",
      url: "https://example.com/source",
      publisher: "Example",
      freshness: "seasonal",
      verifiedAt: "2026-08-25",
    },
  ];

  assert.match(
    validateSources(sources)
      .map((issue) => issue.message)
      .join("\n"),
    /seasonal sources require a review date/,
  );
});

test("duplicate trigger ids fail the build-time assertion", () => {
  const trip = cloneTrip();
  trip.fallbackPlans[1].triggers[0].id = trip.fallbackPlans[0].triggers[0].id;

  assert.throws(
    () => assertValidTrip(trip, chuanxiSources),
    /duplicate id: TRIGGER-B-YUZIXI/,
  );
});
