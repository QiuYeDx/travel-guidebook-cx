import type {
  FallbackTrigger,
  RouteLeg,
  ScenicCatalog,
  ScenicCorridor,
  ScenicItem,
  SourceRef,
  Trip,
  Viewpoint,
} from "./types";

export type ValidationIssue = {
  path: string;
  message: string;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function addUtcDays(value: string, days: number): string {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function dayDifference(from: string, to: string): number {
  const start = new Date(`${from}T00:00:00.000Z`).valueOf();
  const end = new Date(`${to}T00:00:00.000Z`).valueOf();
  return Math.round((end - start) / 86_400_000);
}

function validateText(value: string, path: string, issues: ValidationIssue[]) {
  if (value.trim().length === 0) {
    issues.push({ path, message: "must not be empty" });
  }
}

function validateRange(
  value: [number, number] | undefined,
  path: string,
  issues: ValidationIssue[],
  maximum?: number,
) {
  if (!value) return;

  const [minimum, maximumValue] = value;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximumValue)) {
    issues.push({ path, message: "must contain finite numbers" });
    return;
  }
  if (minimum < 0 || maximumValue < minimum) {
    issues.push({ path, message: "must be a non-negative ascending range" });
  }
  if (maximum !== undefined && maximumValue > maximum) {
    issues.push({ path, message: `must not exceed ${maximum}` });
  }
}

function validateUniqueIds(
  values: readonly { id: string }[],
  path: string,
  issues: ValidationIssue[],
) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value.id)) {
      issues.push({ path, message: `duplicate id: ${value.id}` });
    }
    seen.add(value.id);
  }
}

function validateTrigger(
  trigger: FallbackTrigger,
  path: string,
  issues: ValidationIssue[],
) {
  validateText(trigger.id, `${path}.id`, issues);
  validateText(trigger.condition, `${path}.condition`, issues);
  validateText(trigger.action, `${path}.action`, issues);
}

function validateLeg(leg: RouteLeg, path: string, issues: ValidationIssue[]) {
  validateText(leg.id, `${path}.id`, issues);
  validateText(leg.from, `${path}.from`, issues);
  validateText(leg.to, `${path}.to`, issues);
  validateText(leg.navigationQuery, `${path}.navigationQuery`, issues);
  validateRange(leg.distanceKmEstimate, `${path}.distanceKmEstimate`, issues);
  validateRange(
    leg.driveMinutesEstimate,
    `${path}.driveMinutesEstimate`,
    issues,
  );

  if (
    leg.targetArrivalSoc !== undefined &&
    (!Number.isFinite(leg.targetArrivalSoc) ||
      leg.targetArrivalSoc < 0 ||
      leg.targetArrivalSoc > 100)
  ) {
    issues.push({
      path: `${path}.targetArrivalSoc`,
      message: "must be between 0 and 100",
    });
  }

  if (leg.latestArrival && !TIME_PATTERN.test(leg.latestArrival)) {
    issues.push({
      path: `${path}.latestArrival`,
      message: "must use HH:mm 24-hour format",
    });
  }
}

export function validateSources(
  sources: readonly SourceRef[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  validateUniqueIds(sources, "sources", issues);

  sources.forEach((source, index) => {
    const path = `sources[${index}]`;
    validateText(source.id, `${path}.id`, issues);
    validateText(source.title, `${path}.title`, issues);
    validateText(source.publisher, `${path}.publisher`, issues);

    try {
      const url = new URL(source.url);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        issues.push({ path: `${path}.url`, message: "must use http or https" });
      }
    } catch {
      issues.push({ path: `${path}.url`, message: "must be a valid URL" });
    }

    if (!isIsoDate(source.verifiedAt)) {
      issues.push({
        path: `${path}.verifiedAt`,
        message: "must be an ISO date",
      });
    }
    if (source.reviewAt && !isIsoDate(source.reviewAt)) {
      issues.push({ path: `${path}.reviewAt`, message: "must be an ISO date" });
    }
    if (source.freshness !== "stable" && !source.reviewAt) {
      issues.push({
        path: `${path}.reviewAt`,
        message: `${source.freshness} sources require a review date`,
      });
    }
    if (
      source.reviewAt &&
      isIsoDate(source.verifiedAt) &&
      isIsoDate(source.reviewAt) &&
      source.reviewAt < source.verifiedAt
    ) {
      issues.push({
        path: `${path}.reviewAt`,
        message: "must not be earlier than verifiedAt",
      });
    }
  });

  return issues;
}

export function validateTrip(
  trip: Trip,
  sources: readonly SourceRef[],
): ValidationIssue[] {
  const issues = validateSources(sources);
  const sourceIds = new Set(sources.map((source) => source.id));
  const declaredSourceIds = new Set(trip.sourceIds);

  validateText(trip.id, "trip.id", issues);
  validateText(trip.name, "trip.name", issues);
  validateText(trip.contentVersion, "trip.contentVersion", issues);

  if (!isIsoDate(trip.startDate)) {
    issues.push({ path: "trip.startDate", message: "must be an ISO date" });
  }
  if (!isIsoDate(trip.endDate)) {
    issues.push({ path: "trip.endDate", message: "must be an ISO date" });
  }
  if (
    isIsoDate(trip.startDate) &&
    isIsoDate(trip.endDate) &&
    trip.endDate < trip.startDate
  ) {
    issues.push({
      path: "trip.endDate",
      message: "must not precede startDate",
    });
  }

  if (new Set(trip.sourceIds).size !== trip.sourceIds.length) {
    issues.push({
      path: "trip.sourceIds",
      message: "must not contain duplicates",
    });
  }
  trip.sourceIds.forEach((sourceId) => {
    if (!sourceIds.has(sourceId)) {
      issues.push({
        path: "trip.sourceIds",
        message: `unknown source id: ${sourceId}`,
      });
    }
  });

  validateUniqueIds(trip.days, "trip.days", issues);
  if (isIsoDate(trip.startDate) && isIsoDate(trip.endDate)) {
    const expectedDayCount = dayDifference(trip.startDate, trip.endDate) + 1;
    if (trip.days.length !== expectedDayCount) {
      issues.push({
        path: "trip.days",
        message: `expected ${expectedDayCount} days, received ${trip.days.length}`,
      });
    }
  }

  const legIds: { id: string }[] = [];
  const triggerIds: { id: string }[] = [];

  trip.days.forEach((day, index) => {
    const path = `trip.days[${index}]`;
    if (day.dayNumber !== index) {
      issues.push({ path: `${path}.dayNumber`, message: `expected ${index}` });
    }
    if (day.id !== `D${day.dayNumber}`) {
      issues.push({
        path: `${path}.id`,
        message: `expected D${day.dayNumber}`,
      });
    }
    if (!isIsoDate(day.date)) {
      issues.push({ path: `${path}.date`, message: "must be an ISO date" });
    } else if (isIsoDate(trip.startDate)) {
      const expectedDate = addUtcDays(trip.startDate, index);
      if (day.date !== expectedDate) {
        issues.push({
          path: `${path}.date`,
          message: `expected ${expectedDate}`,
        });
      }
    }

    validateText(day.title, `${path}.title`, issues);
    validateText(day.overnight.place, `${path}.overnight.place`, issues);
    validateRange(
      day.overnight.altitudeMEstimate,
      `${path}.overnight.altitudeMEstimate`,
      issues,
      9_000,
    );
    validateText(day.primaryGoal, `${path}.primaryGoal`, issues);

    day.legs.forEach((leg, legIndex) => {
      validateLeg(leg, `${path}.legs[${legIndex}]`, issues);
      legIds.push(leg);
    });
    day.fallbackTriggers.forEach((trigger, triggerIndex) => {
      validateTrigger(
        trigger,
        `${path}.fallbackTriggers[${triggerIndex}]`,
        issues,
      );
      triggerIds.push(trigger);
    });

    if (new Set(day.sourceIds).size !== day.sourceIds.length) {
      issues.push({
        path: `${path}.sourceIds`,
        message: "must not contain duplicates",
      });
    }
    day.sourceIds.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        issues.push({
          path: `${path}.sourceIds`,
          message: `unknown source id: ${sourceId}`,
        });
      } else if (!declaredSourceIds.has(sourceId)) {
        issues.push({
          path: `${path}.sourceIds`,
          message: `source id is not declared by trip: ${sourceId}`,
        });
      }
    });
  });

  validateUniqueIds(legIds, "trip.days.legs", issues);
  validateUniqueIds(trip.fallbackPlans, "trip.fallbackPlans", issues);

  const fallbackPlanIds = new Set(trip.fallbackPlans.map((plan) => plan.id));
  if (!fallbackPlanIds.has("B") || !fallbackPlanIds.has("C")) {
    issues.push({
      path: "trip.fallbackPlans",
      message: "must define both B and C plans",
    });
  }

  trip.fallbackPlans.forEach((plan, planIndex) => {
    const path = `trip.fallbackPlans[${planIndex}]`;
    validateText(plan.title, `${path}.title`, issues);
    validateText(plan.description, `${path}.description`, issues);
    if (plan.triggers.length === 0) {
      issues.push({ path: `${path}.triggers`, message: "must not be empty" });
    }
    plan.triggers.forEach((trigger, triggerIndex) => {
      validateTrigger(trigger, `${path}.triggers[${triggerIndex}]`, issues);
      triggerIds.push(trigger);
    });

    const planDates = new Set<string>();
    plan.days.forEach((day, dayIndex) => {
      const dayPath = `${path}.days[${dayIndex}]`;
      if (!isIsoDate(day.date)) {
        issues.push({
          path: `${dayPath}.date`,
          message: "must be an ISO date",
        });
      } else if (day.date < trip.startDate || day.date > trip.endDate) {
        issues.push({
          path: `${dayPath}.date`,
          message: "must fall within the trip",
        });
      }
      if (planDates.has(day.date)) {
        issues.push({
          path: `${path}.days`,
          message: `duplicate date: ${day.date}`,
        });
      }
      planDates.add(day.date);
      validateText(day.routeSummary, `${dayPath}.routeSummary`, issues);
      validateText(day.primaryGoal, `${dayPath}.primaryGoal`, issues);
    });
  });

  validateUniqueIds(triggerIds, "trip.fallbackTriggers", issues);
  return issues;
}

export function assertValidTrip<T extends Trip>(
  trip: T,
  sources: readonly SourceRef[],
): T {
  const issues = validateTrip(trip, sources);
  if (issues.length > 0) {
    const details = issues
      .map((issue) => `- ${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid trip data:\n${details}`);
  }
  return trip;
}

const NON_NAVIGABLE_PARKING_LEVELS = new Set([
  "P2",
  "prohibited",
  "transit-only",
  "walk-only",
]);

function validateScenicSources(
  item: ScenicItem,
  path: string,
  trip: Trip,
  sourceIds: Set<string>,
  issues: ValidationIssue[],
) {
  if (new Set(item.sourceIds).size !== item.sourceIds.length) {
    issues.push({
      path: `${path}.sourceIds`,
      message: "must not contain duplicates",
    });
  }
  const tripSourceIds = new Set(trip.sourceIds);
  item.sourceIds.forEach((sourceId) => {
    if (!sourceIds.has(sourceId)) {
      issues.push({
        path: `${path}.sourceIds`,
        message: `unknown source id: ${sourceId}`,
      });
    } else if (!tripSourceIds.has(sourceId)) {
      issues.push({
        path: `${path}.sourceIds`,
        message: `source id is not declared by trip: ${sourceId}`,
      });
    }
  });
}

function validateGeoRef(
  item: ScenicItem,
  path: string,
  legDayById: Map<string, string>,
  issues: ValidationIssue[],
) {
  const geoPath = `${path}.geoRef`;
  const geoRef = item.geoRef;

  if (geoRef.kind === "exact") {
    if (!Number.isFinite(geoRef.lat) || geoRef.lat < -90 || geoRef.lat > 90) {
      issues.push({
        path: `${geoPath}.lat`,
        message: "must be between -90 and 90",
      });
    }
    if (!Number.isFinite(geoRef.lng) || geoRef.lng < -180 || geoRef.lng > 180) {
      issues.push({
        path: `${geoPath}.lng`,
        message: "must be between -180 and 180",
      });
    }
    if (geoRef.coordinateSystem !== "gcj02") {
      issues.push({
        path: `${geoPath}.coordinateSystem`,
        message: "must be gcj02 for Amap navigation",
      });
    }
    validateText(geoRef.mapQuery, `${geoPath}.mapQuery`, issues);
    if (!isIsoDate(geoRef.verifiedAt)) {
      issues.push({
        path: `${geoPath}.verifiedAt`,
        message: "must be an ISO date",
      });
    }
    return;
  }

  if (geoRef.kind === "none") {
    validateText(geoRef.reason, `${geoPath}.reason`, issues);
    return;
  }

  validateText(geoRef.fromLabel, `${geoPath}.fromLabel`, issues);
  validateText(geoRef.toLabel, `${geoPath}.toLabel`, issues);
  const legDayId = legDayById.get(geoRef.routeLegId);
  if (!legDayId) {
    issues.push({
      path: `${geoPath}.routeLegId`,
      message: `unknown route leg id: ${geoRef.routeLegId}`,
    });
  } else if (legDayId !== item.dayId) {
    issues.push({
      path: `${geoPath}.routeLegId`,
      message: `route leg belongs to ${legDayId}, not ${item.dayId}`,
    });
  }
}

function validateParking(
  item: ScenicItem,
  path: string,
  issues: ValidationIssue[],
) {
  const parkingPath = `${path}.parking`;
  validateText(item.parking.note, `${parkingPath}.note`, issues);

  if (!item.parking.parkingNavigationQuery) return;

  if (NON_NAVIGABLE_PARKING_LEVELS.has(item.parking.level)) {
    issues.push({
      path: `${parkingPath}.parkingNavigationQuery`,
      message: `${item.parking.level} parking must not expose parking navigation`,
    });
  }
  if (item.geoRef.kind !== "exact") {
    issues.push({
      path: `${parkingPath}.parkingNavigationQuery`,
      message: "parking navigation requires an exact geo reference",
    });
  }
  if (item.parking.verificationStatus !== "verified") {
    issues.push({
      path: `${parkingPath}.parkingNavigationQuery`,
      message: "parking navigation requires verified parking",
    });
  }
}

function validateViewpoint(
  item: Viewpoint,
  path: string,
  issues: ValidationIssue[],
) {
  if (!item.id.startsWith("VP-")) {
    issues.push({
      path: `${path}.id`,
      message: "viewpoint ids must start with VP-",
    });
  }
  if (item.geoRef.kind === "route-interval") {
    issues.push({
      path: `${path}.geoRef`,
      message: "viewpoints must use exact or none geo references",
    });
  }
  validateRange(
    item.stayMinutesEstimate,
    `${path}.stayMinutesEstimate`,
    issues,
  );
}

function validateCorridor(
  item: ScenicCorridor,
  path: string,
  issues: ValidationIssue[],
) {
  if (!item.id.startsWith("SC-")) {
    issues.push({
      path: `${path}.id`,
      message: "corridor ids must start with SC-",
    });
  }
  if (item.geoRef.kind !== "route-interval") {
    issues.push({
      path: `${path}.geoRef`,
      message: "scenic corridors must use a route-interval geo reference",
    });
  } else if (item.geoRef.routeLegId !== item.routeLegId) {
    issues.push({
      path: `${path}.geoRef.routeLegId`,
      message: "must match the corridor routeLegId",
    });
  }
  validateText(item.passengerCue, `${path}.passengerCue`, issues);
  if (item.parking.parkingNavigationQuery) {
    issues.push({
      path: `${path}.parking.parkingNavigationQuery`,
      message: "scenic corridors must not expose parking navigation",
    });
  }
}

export function validateScenicCatalog(
  catalog: ScenicCatalog,
  trip: Trip,
  sources: readonly SourceRef[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tripDayIds = new Set(trip.days.map((day) => day.id));
  const sourceIds = new Set(sources.map((source) => source.id));
  const itemById = new Map(catalog.items.map((item) => [item.id, item]));
  const legDayById = new Map(
    trip.days.flatMap((day) =>
      day.legs.map((leg) => [leg.id, day.id] as const),
    ),
  );

  if (catalog.tripId !== trip.id) {
    issues.push({ path: "scenic.tripId", message: `expected ${trip.id}` });
  }
  validateText(catalog.contentVersion, "scenic.contentVersion", issues);
  validateUniqueIds(catalog.items, "scenic.items", issues);

  if (
    new Set(catalog.dayPlans.map((plan) => plan.dayId)).size !==
    catalog.dayPlans.length
  ) {
    issues.push({
      path: "scenic.dayPlans",
      message: "must not contain duplicate day ids",
    });
  }

  const dayPlanIds = new Set(catalog.dayPlans.map((plan) => plan.dayId));
  trip.days.slice(1).forEach((day) => {
    if (!dayPlanIds.has(day.id)) {
      issues.push({
        path: "scenic.dayPlans",
        message: `missing day plan: ${day.id}`,
      });
    }
  });

  const sequenceByDay = new Map<string, Set<number>>();
  catalog.items.forEach((item, index) => {
    const path = `scenic.items[${index}]`;
    validateText(item.id, `${path}.id`, issues);
    validateText(item.title, `${path}.title`, issues);
    if (!tripDayIds.has(item.dayId)) {
      issues.push({
        path: `${path}.dayId`,
        message: `unknown trip day: ${item.dayId}`,
      });
    }
    if (!dayPlanIds.has(item.dayId)) {
      issues.push({
        path: `${path}.dayId`,
        message: `missing scenic day plan: ${item.dayId}`,
      });
    }
    if (!Number.isInteger(item.sequence) || item.sequence <= 0) {
      issues.push({
        path: `${path}.sequence`,
        message: "must be a positive integer",
      });
    }
    const seenSequences = sequenceByDay.get(item.dayId) ?? new Set<number>();
    if (seenSequences.has(item.sequence)) {
      issues.push({
        path: `${path}.sequence`,
        message: `duplicate sequence ${item.sequence} for ${item.dayId}`,
      });
    }
    seenSequences.add(item.sequence);
    sequenceByDay.set(item.dayId, seenSequences);

    if (item.subjects.length === 0) {
      issues.push({ path: `${path}.subjects`, message: "must not be empty" });
    }
    if (item.routeLegId) {
      const legDayId = legDayById.get(item.routeLegId);
      if (!legDayId) {
        issues.push({
          path: `${path}.routeLegId`,
          message: `unknown route leg id: ${item.routeLegId}`,
        });
      } else if (legDayId !== item.dayId) {
        issues.push({
          path: `${path}.routeLegId`,
          message: `route leg belongs to ${legDayId}, not ${item.dayId}`,
        });
      }
    }

    validateGeoRef(item, path, legDayById, issues);
    validateParking(item, path, issues);
    validateScenicSources(item, path, trip, sourceIds, issues);
    if (item.id.startsWith("VP-")) {
      validateViewpoint(item as Viewpoint, path, issues);
    } else {
      validateCorridor(item as ScenicCorridor, path, issues);
    }
  });

  catalog.dayPlans.forEach((plan, index) => {
    const path = `scenic.dayPlans[${index}]`;
    if (!tripDayIds.has(plan.dayId)) {
      issues.push({
        path: `${path}.dayId`,
        message: `unknown trip day: ${plan.dayId}`,
      });
    }
    validateText(plan.note, `${path}.note`, issues);
    validateRange(plan.photoStopBudget, `${path}.photoStopBudget`, issues);
    if (plan.mode === "road-stops" && !plan.photoStopBudget) {
      issues.push({
        path: `${path}.photoStopBudget`,
        message: "road-stops require a budget",
      });
    }
    if (plan.mode === "reuse" && !plan.reuse) {
      issues.push({
        path: `${path}.reuse`,
        message: "reuse mode requires a reuse plan",
      });
    }
    if (plan.mode !== "reuse" && plan.reuse) {
      issues.push({
        path: `${path}.reuse`,
        message: "only reuse mode may define reuse",
      });
    }
    if (!plan.reuse) return;

    if (!tripDayIds.has(plan.reuse.sourceDayId)) {
      issues.push({
        path: `${path}.reuse.sourceDayId`,
        message: `unknown source day: ${plan.reuse.sourceDayId}`,
      });
    }
    if (plan.reuse.sourceDayId === plan.dayId) {
      issues.push({
        path: `${path}.reuse.sourceDayId`,
        message: "must reference another day",
      });
    }
    if (
      !Number.isInteger(plan.reuse.maxSelections) ||
      plan.reuse.maxSelections <= 0 ||
      plan.reuse.maxSelections > plan.reuse.itemIds.length
    ) {
      issues.push({
        path: `${path}.reuse.maxSelections`,
        message: "must be positive and not exceed the reusable item count",
      });
    }
    if (new Set(plan.reuse.itemIds).size !== plan.reuse.itemIds.length) {
      issues.push({
        path: `${path}.reuse.itemIds`,
        message: "must not contain duplicates",
      });
    }
    plan.reuse.itemIds.forEach((itemId) => {
      const item = itemById.get(itemId);
      if (!item) {
        issues.push({
          path: `${path}.reuse.itemIds`,
          message: `unknown item id: ${itemId}`,
        });
      } else if (!item.id.startsWith("VP-")) {
        issues.push({
          path: `${path}.reuse.itemIds`,
          message: `${itemId} is not a viewpoint`,
        });
      } else if (item.dayId !== plan.reuse?.sourceDayId) {
        issues.push({
          path: `${path}.reuse.itemIds`,
          message: `${itemId} belongs to ${item.dayId}, not ${plan.reuse?.sourceDayId}`,
        });
      }
    });
  });

  return issues;
}

export function assertValidScenicCatalog<T extends ScenicCatalog>(
  catalog: T,
  trip: Trip,
  sources: readonly SourceRef[],
): T {
  const issues = validateScenicCatalog(catalog, trip, sources);
  if (issues.length > 0) {
    const details = issues
      .map((issue) => `- ${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid scenic catalog:\n${details}`);
  }
  return catalog;
}
