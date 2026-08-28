import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDayHref,
  buildScenicHref,
  normalizeDayGuideTab,
  preserveDayGuideTabForNav,
} from "./day-guide-state";

test("day guide tabs reject unknown URL state", () => {
  assert.equal(normalizeDayGuideTab("route"), "route");
  assert.equal(normalizeDayGuideTab("notes"), "notes");
  assert.equal(normalizeDayGuideTab("unknown"), "overview");
  assert.equal(normalizeDayGuideTab(undefined), "overview");
});

test("day and scenic links carry the selected day tab", () => {
  assert.equal(buildDayHref("D4", "route"), "/days/D4?tab=route");
  assert.equal(
    buildScenicHref("D3", "notes"),
    "/scenic?day=D3&returnTab=notes",
  );
});

test("primary navigation keeps day context when leaving a day page", () => {
  assert.equal(
    preserveDayGuideTabForNav("/itinerary", "/days/D3", "?tab=route"),
    "/itinerary?tab=route",
  );
  assert.equal(
    preserveDayGuideTabForNav("/scenic", "/days/D3", "?tab=notes"),
    "/scenic?day=D3&returnTab=notes",
  );
  assert.equal(
    preserveDayGuideTabForNav("/guidebook", "/days/D3", "?tab=route"),
    "/guidebook",
  );
  assert.equal(
    preserveDayGuideTabForNav("/scenic", "/itinerary", "?tab=route"),
    "/scenic",
  );
});
