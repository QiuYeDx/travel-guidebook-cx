import Link from "next/link";
import { ArrowRightIcon, CalendarRangeIcon, MapPinHouseIcon, RouteIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "./itinerary-model";
import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "./formatters";
import type { ScenicCatalog } from "@/lib/trip/types";

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
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            D0-D9 行程
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            从成都集结到返蓉的 10 天执行顺序。每天只保留一个主目标，现场情况不适合时直接删减当日次要安排。
          </p>
        </div>
      </header>

      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
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
          <p className="flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
            <RouteIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            实时路线仍以当天车机、官方道路信息和现场管制为准。
          </p>
        </aside>
      </div>
    </div>
  );
}
