"use client";

import { ExternalLinkIcon, FileCheck2Icon, RefreshCwIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTripMode } from "@/features/trip/trip-mode-provider";
import type {
  Freshness,
  SourceRef,
  Trip,
  VerificationStatus,
} from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { buildSourceReviewStates, getSourceTripUsage } from "./source-model";

const freshnessLabels: Record<Freshness, string> = {
  stable: "稳定依据",
  seasonal: "季节信息",
  live: "实时信息",
};

const statusLabels: Record<VerificationStatus, string> = {
  verified: "当前无到期动作",
  "needs-review": "需要复核",
  expired: "已过复核日",
};

function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "verified" &&
          "border-emerald-300 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300",
        status === "needs-review" &&
          "border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-300",
        status === "expired" &&
          "border-red-300 text-red-700 dark:border-red-900 dark:text-red-400",
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}

export function SourceCatalog({
  sources,
  trip,
}: {
  sources: SourceRef[];
  trip: Trip;
}) {
  const { clock, hydrated } = useTripMode();
  const states = buildSourceReviewStates(sources, clock.date);
  const counts = states.reduce<Record<VerificationStatus, number>>(
    (result, item) => {
      result[item.status] += 1;
      return result;
    },
    { verified: 0, "needs-review": 0, expired: 0 },
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl border-b pb-7">
        <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <FileCheck2Icon className="size-4" aria-hidden="true" />
          事实来源与时效边界
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          来源与复核状态
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          页面保留每条来源的旧结论和核实日期。“已过复核日”表示需要重新核实，不表示原结论已被证伪。
        </p>
      </header>

      <dl className="mt-6 grid grid-cols-3 divide-x border-y py-4 text-center">
        {[
          ["无到期动作", counts.verified],
          ["进入复核窗口", counts["needs-review"]],
          ["已过复核日", counts.expired],
        ].map(([label, value]) => (
          <div className="min-w-0 px-2" key={label}>
            <dt className="text-xs leading-5 text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">
              {hydrated ? value : "--"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <RefreshCwIcon
          className="mt-0.5 size-3.5 shrink-0"
          aria-hidden="true"
        />
        状态按中国标准时间 {hydrated ? clock.date : "当前日期"}{" "}
        计算：季节信息在复核日前 7 天进入提醒；实时信息在核实次日即需再次查看。
      </div>

      <ol className="mt-8 divide-y border-y">
        {states.map(({ source, status }) => {
          const usedByDays = getSourceTripUsage(source.id, trip);
          return (
            <li
              className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_11rem]"
              key={source.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {freshnessLabels[source.freshness]}
                  </Badge>
                  {hydrated ? <StatusBadge status={status} /> : null}
                </div>
                <h2 className="mt-3 text-base font-semibold leading-6">
                  {source.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {source.publisher}
                </p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">最近核实</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {source.verifiedAt}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">下次复核</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {source.reviewAt ?? "无固定复核日"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">路书引用</dt>
                    <dd className="mt-1 font-medium">
                      {usedByDays.length > 0
                        ? usedByDays.join("·")
                        : "全局依据"}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="sm:text-right">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    打开原始来源
                    <ExternalLinkIcon aria-hidden="true" />
                  </a>
                </Button>
                {hydrated && status === "expired" ? (
                  <p className="mt-3 text-xs leading-5 text-red-700 dark:text-red-400">
                    执行前重新核实，不用旧页面保证当日状态。
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
