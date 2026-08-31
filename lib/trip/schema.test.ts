import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiSources } from "../../data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "../../data/trips/2026-chuanxi/trip";
import type { SourceRef, Trip } from "./types";
import { assertValidTrip, validateSources, validateTrip } from "./schema";

function cloneTrip(): Trip {
  return structuredClone(chuanxiTrip);
}

test("the 2026 Chuanxi baseline satisfies the data contract", () => {
  assert.deepEqual(validateTrip(chuanxiTrip, chuanxiSources), []);
  assert.equal(assertValidTrip(chuanxiTrip, chuanxiSources), chuanxiTrip);
});

test("driving days expose the guidebook target arrival state of charge", () => {
  assert.deepEqual(
    chuanxiTrip.days.flatMap((day) =>
      day.legs.map((leg) => [day.id, leg.targetArrivalSoc]),
    ),
    [
      ["D0", 25],
      ["D1", 35],
      ["D2", 35],
      ["D3", 40],
      ["D4", 55],
      ["D5", 35],
      ["D6", 40],
      ["D7", 45],
      ["D8", 35],
      ["D9", 20],
    ],
  );
});

test("dates, route titles, intensity, and overnight places match guidebook v1.0", () => {
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
        id: "D0",
        date: "2026-09-27",
        title: "深圳 → 贵阳",
        intensity: "medium-high",
        overnight: "贵阳",
      },
      {
        id: "D1",
        date: "2026-09-28",
        title: "贵阳 → 成都外围 → 都江堰",
        intensity: "medium-high",
        overnight: "都江堰",
      },
      {
        id: "D2",
        date: "2026-09-29",
        title: "都江堰 → 汶川 → 毕棚沟 → 古尔沟",
        intensity: "medium",
        overnight: "古尔沟",
      },
      {
        id: "D3",
        date: "2026-09-30",
        title: "古尔沟 → 米亚罗 → 奶子沟 → 黑水",
        intensity: "medium",
        overnight: "黑水",
      },
      {
        id: "D4",
        date: "2026-10-01",
        title: "达古冰川景区",
        intensity: "medium",
        overnight: "黑水",
      },
      {
        id: "D5",
        date: "2026-10-02",
        title: "黑水 → 马尔康 → 金川",
        intensity: "medium-high",
        overnight: "金川",
      },
      {
        id: "D6",
        date: "2026-10-03",
        title: "金川 → 丹巴 → 八美 → 塔公 → 新都桥",
        intensity: "medium-high",
        overnight: "新都桥",
      },
      {
        id: "D7",
        date: "2026-10-04",
        title: "新都桥 → 折多山 → 康定 → 雅安",
        intensity: "medium",
        overnight: "雅安",
      },
      {
        id: "D8",
        date: "2026-10-05",
        title: "雅安 → 贵阳",
        intensity: "medium-high",
        overnight: "贵阳",
      },
      {
        id: "D9",
        date: "2026-10-06",
        title: "贵阳 → 深圳",
        intensity: "medium-high",
        overnight: "深圳",
      },
    ],
  );
});

test("trip days are continuous from D0 through D9", () => {
  const trip = cloneTrip();
  trip.days[4].date = "2026-10-02";

  assert.match(
    validateTrip(trip, chuanxiSources)
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("\n"),
    /trip\.days\[4\]\.date: expected 2026-10-01/,
  );
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
    /duplicate id: TRIGGER-B-TIME/,
  );
});
