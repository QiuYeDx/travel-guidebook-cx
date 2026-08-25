import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarRangeIcon,
  MapPinHouseIcon,
  RouteIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FallbackPlan, Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "./itinerary-model";
import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "./formatters";
import type { ScenicCatalog } from "@/lib/trip/types";

function FallbackPlanPanel({ plan }: { plan: FallbackPlan }) {
  return (
    <section
      aria-labelledby={`fallback-${plan.id}`}
      className="rounded-md border bg-muted/25 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            方案 {plan.id} · 任一条件触发
          </p>
          <h2
            id={`fallback-${plan.id}`}
            className="mt-1 text-base font-semibold"
          >
            {plan.title}
          </h2>
        </div>
        <ShieldAlertIcon
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {plan.description}
      </p>
      <ul className="mt-4 space-y-3 border-t pt-4">
        {plan.triggers.map((trigger) => (
          <li className="text-xs leading-5" key={trigger.id}>
            <p className="font-medium text-foreground/85">
              {trigger.condition}
            </p>
            <p className="mt-1 text-muted-foreground">{trigger.action}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ItineraryTimeline({
  trip,
  scenicCatalog,
}: {
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <nav aria-label="面包屑" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          总览
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">行程</span>
      </nav>

      <header className="mt-6 grid gap-5 border-b pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
            主线 A
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            D0-D9 行程时间线
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            从成都集结到返蓉的 10
            天执行顺序。每天只保留一个主目标，天气、身体、道路或预约不满足时切换
            B / C 方案。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/guidebook#主线-a-总表">
            查看完整攻略依据
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <section aria-labelledby="primary-timeline-title">
          <div className="flex items-center gap-2">
            <CalendarRangeIcon
              className="size-5 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <h2 id="primary-timeline-title" className="text-xl font-semibold">
              推荐主线 A
            </h2>
          </div>

          <ol className="mt-5 divide-y border-y">
            {trip.days.map((day) => {
              const itinerary = buildDayItinerary(trip, scenicCatalog, day.id);
              if (!itinerary) return null;
              return (
                <li key={day.id}>
                  <Link
                    href={`/days/${day.id}`}
                    className="group grid min-h-28 gap-4 py-5 transition-colors hover:bg-muted/45 focus-visible:bg-muted/45 sm:grid-cols-[5rem_minmax(0,1fr)_9rem_1.5rem] sm:items-center sm:px-3"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {day.id}
                      </p>
                      <time
                        className="mt-1 block text-xs text-muted-foreground"
                        dateTime={day.date}
                      >
                        {formatTripDate(day.date)}
                      </time>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold leading-6">
                          {day.title}
                        </h3>
                        <Badge variant="outline">
                          强度 {intensityLabels[day.intensity]}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {day.primaryGoal}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs sm:block sm:text-right">
                      <div>
                        <p className="text-muted-foreground">里程 / 驾驶</p>
                        <p className="mt-1 font-medium text-foreground/80">
                          {formatNumberRange(
                            itinerary.distanceKmEstimate,
                            "km",
                          )}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          {formatDriveTime(itinerary.driveMinutesEstimate)}
                        </p>
                      </div>
                      <div className="sm:mt-3">
                        <p className="flex items-center gap-1 text-muted-foreground sm:justify-end">
                          <MapPinHouseIcon
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          住宿
                        </p>
                        <p className="mt-1 font-medium text-foreground/80">
                          {day.overnight.place}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon
                      className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {trip.fallbackPlans.map((plan) => (
            <FallbackPlanPanel key={plan.id} plan={plan} />
          ))}
          <p className="flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
            <RouteIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            实时路线仍以当天车机、官方道路信息和现场管制为准。
          </p>
        </aside>
      </div>
    </div>
  );
}
