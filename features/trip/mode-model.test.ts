import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultTripModePreference,
  parseTripModePreference,
  resolveSelectedDayId,
  resolveTripClock,
  type TripModeConfig,
} from "./mode-model";

const config: TripModeConfig = {
  tripId: "trip",
  timezone: "Asia/Shanghai",
  startDate: "2026-09-27",
  endDate: "2026-10-06",
  days: Array.from({ length: 10 }, (_, index) => ({
    id: `D${index}`,
    date:
      index < 4
        ? `2026-09-${String(27 + index).padStart(2, "0")}`
        : `2026-10-${String(index - 3).padStart(2, "0")}`,
    title: `Day ${index}`,
  })),
};

test("China Standard Time starts D0 exactly at the local midnight boundary", () => {
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-09-26T15:59:59.999Z")),
    { date: "2026-09-26", relation: "before", inferredDayId: "D0" },
  );
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-09-26T16:00:00.000Z")),
    { date: "2026-09-27", relation: "during", inferredDayId: "D0" },
  );
});

test("China Standard Time resolves the final day and post-trip boundary", () => {
  assert.equal(
    resolveTripClock(config, new Date("2026-10-06T15:59:59.999Z"))
      .inferredDayId,
    "D9",
  );
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-10-06T16:00:00.000Z")),
    { date: "2026-10-07", relation: "after", inferredDayId: "D9" },
  );
});

test("manual day selection overrides the clock and can return to automatic", () => {
  const clock = resolveTripClock(config, new Date("2026-09-30T04:00:00.000Z"));
  assert.equal(clock.inferredDayId, "D3");
  assert.equal(resolveSelectedDayId(config, clock, "D6"), "D6");
  assert.equal(resolveSelectedDayId(config, clock), "D3");
  assert.equal(resolveSelectedDayId(config, clock, "missing"), "D3");
});

test("persisted mode keeps valid manual days and drops invalid values", () => {
  assert.deepEqual(
    parseTripModePreference(
      JSON.stringify({
        schemaVersion: 1,
        mode: "onTrip",
        manualDayId: "D4",
      }),
      config,
    ),
    { schemaVersion: 1, mode: "onTrip", manualDayId: "D4" },
  );
  assert.deepEqual(
    parseTripModePreference(
      JSON.stringify({
        schemaVersion: 1,
        mode: "planning",
        manualDayId: "D99",
      }),
      config,
    ),
    { schemaVersion: 1, mode: "planning" },
  );
  assert.equal(parseTripModePreference("not-json", config), null);
  assert.deepEqual(createDefaultTripModePreference(), {
    schemaVersion: 1,
    mode: "planning",
  });
});
