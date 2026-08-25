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

test("dates, route titles, intensity, and overnight places match guidebook v0.2", () => {
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
        title: "各地集结成都",
        intensity: "low",
        overnight: "成都西侧",
      },
      {
        id: "D1",
        date: "2026-09-28",
        title: "成都 → 泸定 → 康定",
        intensity: "low",
        overnight: "康定",
      },
      {
        id: "D2",
        date: "2026-09-29",
        title: "康定 → 折多山 → 新都桥",
        intensity: "low-medium",
        overnight: "新都桥",
      },
      {
        id: "D3",
        date: "2026-09-30",
        title: "新都桥 → 雅江 → 理塘 → 稻城 → 香格里拉镇",
        intensity: "medium-high",
        overnight: "香格里拉镇",
      },
      {
        id: "D4",
        date: "2026-10-01",
        title: "稻城亚丁轻量游",
        intensity: "medium",
        overnight: "香格里拉镇",
      },
      {
        id: "D5",
        date: "2026-10-02",
        title: "香格里拉镇 → 稻城 → 理塘 → 雅江",
        intensity: "medium-high",
        overnight: "雅江",
      },
      {
        id: "D6",
        date: "2026-10-03",
        title: "雅江 → 新都桥 → 塔公 → 墨石公园 → 丹巴",
        intensity: "medium",
        overnight: "丹巴",
      },
      {
        id: "D7",
        date: "2026-10-04",
        title: "丹巴 → 小金 → 四姑娘山镇",
        intensity: "low",
        overnight: "四姑娘山镇",
      },
      {
        id: "D8",
        date: "2026-10-05",
        title: "四姑娘山双桥沟",
        intensity: "low-medium",
        overnight: "四姑娘山镇",
      },
      {
        id: "D9",
        date: "2026-10-06",
        title: "四姑娘山镇 → 卧龙 → 映秀 → 成都",
        intensity: "medium",
        overnight: "成都",
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
    /duplicate id: TRIGGER-B-HEALTH/,
  );
});
