import Link from "next/link";
import { AlertTriangleIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SourceReviewState } from "./source-model";

export function SourceReviewAlert({
  reviews,
  asOf,
}: {
  reviews: SourceReviewState[];
  asOf: string;
}) {
  if (reviews.length === 0) return null;

  const expiredCount = reviews.filter(
    (review) => review.status === "expired",
  ).length;

  return (
    <section
      aria-labelledby="source-review-alert-title"
      className="border-b border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/25"
    >
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <AlertTriangleIcon
            className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h2
              id="source-review-alert-title"
              className="text-sm font-semibold"
            >
              {expiredCount > 0
                ? `${expiredCount} 项来源已超过复核日`
                : `${reviews.length} 项来源进入复核窗口`}
            </h2>
            <p className="mt-1 text-xs leading-5 text-amber-950/75 dark:text-amber-100/75">
              截至 {asOf}，
              {reviews
                .slice(0, 2)
                .map((review) => review.source.publisher)
                .join("、")}
              {reviews.length > 2 ? ` 等 ${reviews.length} 项` : ""}
              需重新核实。旧结论仍保留，但不应继续当作当日保证。
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/sources">
            查看来源与复核
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
