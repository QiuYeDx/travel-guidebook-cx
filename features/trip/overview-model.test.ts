import assert from "node:assert/strict";
import test from "node:test";

import { chuanxiPlanningSnapshot } from "../../data/trips/2026-chuanxi/planning";
import { chuanxiSources } from "../../data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "../../data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "../../data/trips/2026-chuanxi/viewpoints";
import { buildTripOverview } from "./overview-model";

test("the planning dashboard is derived from structured trip data", () => {
  const overview = buildTripOverview(
    chuanxiTrip,
    chuanxiScenicCatalog,
    chuanxiSources,
    chuanxiPlanningSnapshot,
  );

  assert.equal(overview.durationDays, 10);
  assert.equal(overview.drivingDays, 10);
  assert.deepEqual(overview.distanceKmEstimate, [4380, 5080]);
  assert.equal(overview.scenicItemCount, 37);
  assert.equal(overview.routeNodes.at(0)?.id, "D0");
  assert.equal(overview.routeNodes.at(-1)?.id, "D9");
  assert.equal(overview.openDecisionCount, 2);
  assert.equal(overview.confirmedTaskCount, 0);
  assert.equal(overview.taskCount, 5);
  assert.equal(overview.lastVerifiedAt, "2026-08-31");
  assert.equal(overview.nextReviewAt, "2026-09-20");
  assert.ok(overview.criticalRisks.length >= 3);
  assert.equal(overview.criticalRisks[0]?.severity, "stop");
});

test("planning snapshot deadlines remain within the planning window", () => {
  for (const item of [
    ...chuanxiPlanningSnapshot.decisions,
    ...chuanxiPlanningSnapshot.tasks,
  ]) {
    assert.ok(item.deadline.date >= chuanxiPlanningSnapshot.updatedAt);
    assert.ok(item.deadline.date <= chuanxiTrip.startDate);
  }
});
