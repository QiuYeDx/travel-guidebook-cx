import type { PlanningSnapshot, Trip } from "./types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function assertUniqueIds(ids: string[], label: string): void {
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label} ids must be unique`);
  }
}

export function assertValidPlanningSnapshot(
  snapshot: PlanningSnapshot,
  trip: Trip,
): PlanningSnapshot {
  if (snapshot.tripId !== trip.id) {
    throw new Error("Planning snapshot tripId must match the trip");
  }
  if (!isIsoDate(snapshot.updatedAt)) {
    throw new Error("Planning snapshot updatedAt must use a real ISO date");
  }
  if (snapshot.updatedAt > trip.startDate) {
    throw new Error("Planning snapshot cannot be newer than the trip start");
  }

  assertUniqueIds(
    snapshot.decisions.map((item) => item.id),
    "Planning decision",
  );
  assertUniqueIds(
    snapshot.tasks.map((item) => item.id),
    "Planning task",
  );

  for (const item of [...snapshot.decisions, ...snapshot.tasks]) {
    if (!isIsoDate(item.deadline.date)) {
      throw new Error(`${item.id} deadline must use a real ISO date`);
    }
    if (item.deadline.date < snapshot.updatedAt) {
      throw new Error(`${item.id} deadline cannot predate the snapshot`);
    }
    if (item.deadline.date > trip.endDate) {
      throw new Error(`${item.id} deadline cannot be after the trip ends`);
    }
  }

  return snapshot;
}
