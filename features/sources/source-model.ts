import type { SourceRef, Trip, VerificationStatus } from "@/lib/trip/types";

export const sourceReviewWarningDays = 7;

export type SourceReviewState = {
  source: SourceRef;
  status: VerificationStatus;
  daysUntilReview?: number;
};

function dateDifference(from: string, to: string): number {
  const start = new Date(`${from}T00:00:00.000Z`).valueOf();
  const end = new Date(`${to}T00:00:00.000Z`).valueOf();
  return Math.round((end - start) / 86_400_000);
}

export function getSourceVerificationStatus(
  source: SourceRef,
  asOf: string,
  warningDays = sourceReviewWarningDays,
): SourceReviewState {
  const daysUntilReview = source.reviewAt
    ? dateDifference(asOf, source.reviewAt)
    : undefined;

  if (daysUntilReview !== undefined && daysUntilReview < 0) {
    return { source, status: "expired", daysUntilReview };
  }

  if (source.freshness === "live" && asOf > source.verifiedAt) {
    return { source, status: "needs-review", daysUntilReview };
  }

  if (
    source.freshness !== "live" &&
    daysUntilReview !== undefined &&
    daysUntilReview <= Math.max(0, warningDays)
  ) {
    return { source, status: "needs-review", daysUntilReview };
  }

  return { source, status: "verified", daysUntilReview };
}

export function buildSourceReviewStates(
  sources: readonly SourceRef[],
  asOf: string,
): SourceReviewState[] {
  return sources.map((source) => getSourceVerificationStatus(source, asOf));
}

export function getActionableSourceReviews(
  sources: readonly SourceRef[],
  asOf: string,
): SourceReviewState[] {
  const rank: Record<VerificationStatus, number> = {
    expired: 0,
    "needs-review": 1,
    verified: 2,
  };

  return buildSourceReviewStates(sources, asOf)
    .filter((item) => item.status !== "verified")
    .sort(
      (a, b) =>
        rank[a.status] - rank[b.status] ||
        (a.source.reviewAt ?? "9999-12-31").localeCompare(
          b.source.reviewAt ?? "9999-12-31",
        ),
    );
}

export function getSourceTripUsage(sourceId: string, trip: Trip): string[] {
  return trip.days
    .filter((day) => day.sourceIds.includes(sourceId))
    .map((day) => day.id);
}
