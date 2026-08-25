import type {
  ParkingLevel,
  ScenicCorridor,
  ScenicItem,
  ScenicSubject,
  SourceRef,
  TravelDirection,
  VerificationStatus,
  ViewpointPriority,
} from "@/lib/trip/types";

export type ScenicFilters = {
  priority: "all" | ViewpointPriority;
  parking: "all" | ParkingLevel;
  subject: "all" | ScenicSubject;
  direction: "all" | TravelDirection;
  verification: "all" | VerificationStatus;
};

export const defaultScenicFilters: ScenicFilters = {
  priority: "all",
  parking: "all",
  subject: "all",
  direction: "all",
  verification: "all",
};

const subjectOrder: ScenicSubject[] = [
  "snow-mountain",
  "mountain",
  "valley",
  "road",
  "grassland",
  "river",
  "wetland",
  "village",
  "town",
  "forest",
  "lake",
  "geology",
  "architecture",
  "culture",
];

export function isScenicCorridor(item: ScenicItem): item is ScenicCorridor {
  return item.id.startsWith("SC-");
}

function matchesDirection(
  itemDirection: TravelDirection,
  filter: ScenicFilters["direction"],
): boolean {
  if (filter === "all") return true;
  if (filter === "both") return itemDirection === "both";
  return itemDirection === filter || itemDirection === "both";
}

export function filterScenicItems(
  items: ScenicItem[],
  filters: ScenicFilters,
): ScenicItem[] {
  return items.filter(
    (item) =>
      (filters.priority === "all" || item.priority === filters.priority) &&
      (filters.parking === "all" || item.parking.level === filters.parking) &&
      (filters.subject === "all" || item.subjects.includes(filters.subject)) &&
      matchesDirection(item.direction, filters.direction) &&
      (filters.verification === "all" ||
        item.parking.verificationStatus === filters.verification),
  );
}

export function countActiveScenicFilters(filters: ScenicFilters): number {
  return Object.values(filters).filter((value) => value !== "all").length;
}

export function getAvailableSubjects(items: ScenicItem[]): ScenicSubject[] {
  const available = new Set(items.flatMap((item) => item.subjects));
  return subjectOrder.filter((subject) => available.has(subject));
}

export function resolveSelectedScenicItem(
  items: ScenicItem[],
  requestedId?: string,
): ScenicItem | undefined {
  return items.find((item) => item.id === requestedId) ?? items[0];
}

export function getParkingNavigationQuery(
  item: ScenicItem,
): string | undefined {
  const eligibleLevel =
    item.parking.level === "P0" || item.parking.level === "P1";
  if (
    !eligibleLevel ||
    item.parking.verificationStatus !== "verified" ||
    item.geoRef.kind !== "exact"
  ) {
    return undefined;
  }
  return item.parking.parkingNavigationQuery;
}

export function getItemSources(
  item: ScenicItem,
  sources: SourceRef[],
): SourceRef[] {
  const sourceIds = new Set(item.sourceIds);
  return sources.filter((source) => sourceIds.has(source.id));
}
