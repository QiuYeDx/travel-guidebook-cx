export type TripMode = "planning" | "onTrip";
export type TripDateRelation = "before" | "during" | "after";

export type TripModeDay = {
  id: string;
  date: string;
  title: string;
};

export type TripModeConfig = {
  tripId: string;
  timezone: "Asia/Shanghai";
  startDate: string;
  endDate: string;
  days: TripModeDay[];
};

export type TripModePreference = {
  schemaVersion: 1;
  mode: TripMode;
  manualDayId?: string;
};

export type TripClockState = {
  date: string;
  relation: TripDateRelation;
  inferredDayId: string;
};

export const tripModeSchemaVersion = 1;

export function createTripModeStorageKey(tripId: string): string {
  return `travel-guidebook:trip-mode:${tripId}`;
}

export function getDateInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function resolveTripClock(
  config: TripModeConfig,
  now: Date,
): TripClockState {
  const date = getDateInTimeZone(now, config.timezone);
  const firstDayId = config.days[0]?.id ?? "D1";
  const lastDayId = config.days.at(-1)?.id ?? firstDayId;

  if (date < config.startDate) {
    return { date, relation: "before", inferredDayId: firstDayId };
  }
  if (date > config.endDate) {
    return { date, relation: "after", inferredDayId: lastDayId };
  }

  return {
    date,
    relation: "during",
    inferredDayId:
      config.days.find((day) => day.date === date)?.id ?? firstDayId,
  };
}

export function parseTripModePreference(
  rawValue: string | null,
  config: TripModeConfig,
): TripModePreference | null {
  if (!rawValue) return null;
  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== "object") return null;
    const candidate = value as Partial<TripModePreference>;
    if (
      candidate.schemaVersion !== tripModeSchemaVersion ||
      (candidate.mode !== "planning" && candidate.mode !== "onTrip")
    ) {
      return null;
    }
    const validDayIds = new Set(config.days.map((day) => day.id));
    return {
      schemaVersion: tripModeSchemaVersion,
      mode: candidate.mode,
      ...(candidate.manualDayId && validDayIds.has(candidate.manualDayId)
        ? { manualDayId: candidate.manualDayId }
        : {}),
    };
  } catch {
    return null;
  }
}

export function resolveSelectedDayId(
  config: TripModeConfig,
  clock: TripClockState,
  manualDayId?: string,
): string {
  return config.days.some((day) => day.id === manualDayId)
    ? manualDayId!
    : clock.inferredDayId;
}

export function createDefaultTripModePreference(): TripModePreference {
  return { schemaVersion: tripModeSchemaVersion, mode: "planning" };
}
