import type {
  FallbackTrigger,
  PlanningSnapshot,
  ScenicCatalog,
  SourceRef,
  Trip,
} from "@/lib/trip/types";

export type TripOverview = {
  durationDays: number;
  drivingDays: number;
  distanceKmEstimate: [number, number];
  scenicItemCount: number;
  routeNodes: Array<{
    id: string;
    date: string;
    title: string;
    overnight: string;
  }>;
  openDecisionCount: number;
  confirmedTaskCount: number;
  taskCount: number;
  criticalRisks: FallbackTrigger[];
  lastVerifiedAt?: string;
  nextReviewAt?: string;
  reviewSourceCount: number;
};

const severityRank: Record<FallbackTrigger["severity"], number> = {
  stop: 0,
  "switch-plan": 1,
  warning: 2,
};

export function buildTripOverview(
  trip: Trip,
  scenicCatalog: ScenicCatalog,
  sources: SourceRef[],
  planning: PlanningSnapshot,
): TripOverview {
  const distanceKmEstimate = trip.days
    .flatMap((day) => day.legs)
    .reduce<[number, number]>(
      (total, leg) => {
        if (!leg.distanceKmEstimate) return total;
        return [
          total[0] + leg.distanceKmEstimate[0],
          total[1] + leg.distanceKmEstimate[1],
        ];
      },
      [0, 0],
    );

  const allRisks = [
    ...trip.days.flatMap((day) => day.fallbackTriggers),
    ...trip.fallbackPlans.flatMap((plan) => plan.triggers),
  ].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const seenCategories = new Set<FallbackTrigger["category"]>();
  const criticalRisks = allRisks.filter((risk) => {
    if (seenCategories.has(risk.category)) return false;
    seenCategories.add(risk.category);
    return true;
  });

  const verifiedDates = sources.map((source) => source.verifiedAt).sort();
  const reviewDates = sources
    .flatMap((source) => (source.reviewAt ? [source.reviewAt] : []))
    .filter((date) => date >= planning.updatedAt)
    .sort();

  return {
    durationDays: trip.days.length,
    drivingDays: trip.days.filter((day) => day.legs.length > 0).length,
    distanceKmEstimate,
    scenicItemCount: scenicCatalog.items.length,
    routeNodes: trip.days.map((day) => ({
      id: day.id,
      date: day.date,
      title: day.title,
      overnight: day.overnight.place,
    })),
    openDecisionCount: planning.decisions.filter(
      (item) => item.status !== "confirmed",
    ).length,
    confirmedTaskCount: planning.tasks.filter(
      (item) => item.status === "confirmed",
    ).length,
    taskCount: planning.tasks.length,
    criticalRisks,
    lastVerifiedAt: verifiedDates.at(-1),
    nextReviewAt: reviewDates[0],
    reviewSourceCount: sources.filter((source) => source.reviewAt).length,
  };
}
