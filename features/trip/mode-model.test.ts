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
  startDate: "2026-09-29",
  endDate: "2026-10-05",
  days: [
    { id: "D1", date: "2026-09-29", title: "Day 1" },
    { id: "D2", date: "2026-09-30", title: "Day 2" },
    { id: "D3", date: "2026-10-01", title: "Day 3" },
    { id: "D4", date: "2026-10-02", title: "Day 4" },
    { id: "D5", date: "2026-10-03", title: "Day 5" },
    { id: "D6", date: "2026-10-04", title: "Day 6" },
    { id: "D7", date: "2026-10-05", title: "Day 7" },
  ],
};

test("China Standard Time starts D1 exactly at the local midnight boundary", () => {
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-09-28T15:59:59.999Z")),
    { date: "2026-09-28", relation: "before", inferredDayId: "D1" },
  );
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-09-28T16:00:00.000Z")),
    { date: "2026-09-29", relation: "during", inferredDayId: "D1" },
  );
});

test("China Standard Time resolves the final day and post-trip boundary", () => {
  assert.equal(
    resolveTripClock(config, new Date("2026-10-05T15:59:59.999Z"))
      .inferredDayId,
    "D7",
  );
  assert.deepEqual(
    resolveTripClock(config, new Date("2026-10-05T16:00:00.000Z")),
    { date: "2026-10-06", relation: "after", inferredDayId: "D7" },
  );
});

test("manual day selection overrides the clock and can return to automatic", () => {
  const clock = resolveTripClock(config, new Date("2026-09-30T04:00:00.000Z"));
  assert.equal(clock.inferredDayId, "D2");
  assert.equal(resolveSelectedDayId(config, clock, "D6"), "D6");
  assert.equal(resolveSelectedDayId(config, clock), "D2");
  assert.equal(resolveSelectedDayId(config, clock, "missing"), "D2");
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
