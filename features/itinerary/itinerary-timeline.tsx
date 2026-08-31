"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarRangeIcon,
  Clock3Icon,
  MapPinHouseIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "./itinerary-model";
import {
  buildDayHref,
  normalizeDayGuideTab,
  type DayGuideTab,
} from "./day-guide-state";
import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "./formatters";

export function ItineraryTimeline({
  trip,
  scenicCatalog,
}: {
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
  const [dayTab, setDayTab] = React.useState<DayGuideTab>("overview");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDayTab(normalizeDayGuideTab(params.get("tab")));
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="pb-7">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            D0-D9 · 10 天行程
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            从深圳出发，经贵阳与川西短环线回到深圳。每天只保留一个主目标，
            10 月 4 日到雅安、10 月 5 日到贵阳是返程硬边界。
          </p>
        </div>
      </header>

      <div>
        <section aria-labelledby="primary-timeline-title">
          <div className="flex items-center gap-2">
            <CalendarRangeIcon
              className="size-5 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <h2 id="primary-timeline-title" className="text-xl font-semibold">
              最终路线
            </h2>
          </div>

          <ol className="mt-5 divide-y border-y">
            {trip.days.map((day) => {
              const itinerary = buildDayItinerary(trip, scenicCatalog, day.id);
              if (!itinerary) return null;
              const hasDrivingEstimate = Boolean(
                itinerary.distanceKmEstimate || itinerary.driveMinutesEstimate,
              );
              return (
                <li key={day.id}>
                  <Link
                    href={buildDayHref(day.id, dayTab)}
                    className="group grid grid-cols-[3.75rem_minmax(0,1fr)_1.25rem] items-baseline gap-x-3 gap-y-2 px-1 py-4 transition-colors hover:bg-muted/45 focus-visible:bg-muted/45 sm:px-3 sm:py-3.5 lg:grid-cols-[4.75rem_minmax(0,1fr)_auto_1.25rem] lg:gap-x-4"
                  >
                    <p className="col-start-1 row-start-1 font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {day.id}
                    </p>
                    <time
                      className="col-start-1 row-start-2 text-xs text-muted-foreground"
                      dateTime={day.date}
                    >
                      {formatTripDate(day.date)}
                    </time>
                    <Badge
                      variant="outline"
                      className="col-start-1 row-start-3 h-5 self-center px-1.5 text-[11px] sm:hidden"
                      aria-label={`强度 ${intensityLabels[day.intensity]}`}
                    >
                      {intensityLabels[day.intensity]}
                    </Badge>

                    <div className="col-start-2 row-start-1 flex min-w-0 flex-wrap items-center gap-2">
                      <h3 className="min-w-0 w-full max-w-full break-words text-base font-semibold leading-6 sm:w-auto">
                        {day.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="hidden h-5 px-1.5 text-[11px] sm:inline-flex"
                      >
                        强度 {intensityLabels[day.intensity]}
                      </Badge>
                    </div>
                    <p className="col-start-2 col-end-4 row-start-2 line-clamp-2 min-w-0 text-xs leading-5 text-muted-foreground sm:line-clamp-1 sm:text-sm lg:col-end-3">
                      {day.primaryGoal}
                    </p>

                    <dl className="col-start-2 col-end-4 row-start-3 flex min-w-0 self-center flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 lg:flex-nowrap lg:justify-end lg:gap-x-4">
                      {itinerary.distanceKmEstimate ? (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <dt className="sr-only">里程</dt>
                          <RouteIcon className="size-3.5" aria-hidden="true" />
                          <dd className="font-medium tabular-nums text-foreground/75">
                            {formatNumberRange(
                              itinerary.distanceKmEstimate,
                              "km",
                            )}
                          </dd>
                        </div>
                      ) : null}
                      {itinerary.driveMinutesEstimate ? (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <dt className="sr-only">驾驶时间</dt>
                          <Clock3Icon className="size-3.5" aria-hidden="true" />
                          <dd className="font-medium tabular-nums text-foreground/75">
                            {formatDriveTime(itinerary.driveMinutesEstimate)}
                          </dd>
                        </div>
                      ) : null}
                      {!hasDrivingEstimate ? (
                        <div className="shrink-0">
                          <dt className="sr-only">驾驶安排</dt>
                          <dd>非驾驶日</dd>
                        </div>
                      ) : null}
                      <div className="flex min-w-0 items-center gap-1.5">
                        <dt className="sr-only">住宿</dt>
                        <MapPinHouseIcon
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <dd className="truncate font-medium text-foreground/75 lg:max-w-28">
                          {day.overnight.place}
                        </dd>
                      </div>
                    </dl>
                    <ArrowRightIcon
                      className="col-start-3 row-start-1 size-4 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 lg:col-start-4 lg:row-start-1 lg:row-end-3"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
