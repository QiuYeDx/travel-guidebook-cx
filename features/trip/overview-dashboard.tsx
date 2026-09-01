import type { CSSProperties } from "react";
import Link from "next/link";
import { smoothCorners } from "@qiuyedx/smooth-corners";
import {
  ArrowRightIcon,
  CarFrontIcon,
  MapPinnedIcon,
  MountainSnowIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "../itinerary/itinerary-model";
import { formatDriveTime, formatTripDate } from "../itinerary/formatters";

const overviewSurfaceCorners = smoothCorners(16, 0.72) as CSSProperties;
const dayCardCorners = smoothCorners(12, 0.7) as CSSProperties;

export function OverviewDashboard({
  trip,
  scenicCatalog,
}: {
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
  const drivingDays = trip.days.filter((day) => day.legs.length > 0).length;
  const distance = trip.days
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
      <section
        className="smooth-corners overflow-hidden border bg-card shadow-sm"
        style={overviewSurfaceCorners}
      >
        <div className="grid gap-8 border-b border-border bg-gradient-to-br from-emerald-50 via-background to-background px-5 py-7 text-foreground dark:from-emerald-950/45 dark:via-background dark:to-background sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-col items-start gap-3">
              <Badge
                className="border-emerald-200/80 bg-emerald-100/70 text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/55 dark:text-emerald-100"
                variant="outline"
              >
                2026 · 9/27 — 10/6
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
                深圳往返川西短环线
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              深圳出发，经贵阳进入都江堰、毕棚沟、达古冰川、丹巴、塔公与折多山，10
              月 6 日回到深圳。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/itinerary">
                  查看完整行程 <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-background/70">
                <Link href="/scenic">
                  浏览沿途观景 <MapPinnedIcon aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Metric label="行程" value={`${trip.days.length} 天`} />
            <Metric label="公路移动" value={`${drivingDays} 天`} />
            <Metric
              label="规划里程"
              value={`${distance[0]}–${distance[1]} km`}
            />
            <Metric
              label="观景条目"
              value={`${scenicCatalog.items.length} 处`}
            />
          </div>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-8">
          <QuickFact
            icon={<CarFrontIcon />}
            label="人车"
            value="3 人 · 蔚来 EC6"
          />
          <QuickFact
            icon={<MountainSnowIcon />}
            label="节奏"
            value="三人轮换 · 不夜驾"
          />
          <QuickFact
            icon={<SparklesIcon />}
            label="核心"
            value="达古与塔公 · 10/6 返深"
          />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="route-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              唯一正式路线
            </p>
            <h2 id="route-title" className="mt-1 text-2xl font-semibold">
              每天走什么
            </h2>
          </div>
          <Link
            href="/itinerary"
            className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
          >
            打开时间线 <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trip.days.map((day) => {
            const itinerary = buildDayItinerary(trip, scenicCatalog, day.id);
            return (
              <li key={day.id}>
                <Link
                  href={`/days/${day.id}`}
                  className="smooth-corners group block h-full border bg-card p-4 transition-colors hover:border-emerald-500/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                  style={dayCardCorners}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {day.id}
                      </p>
                      <time
                        className="mt-1 block text-xs text-muted-foreground"
                        dateTime={day.date}
                      >
                        {formatTripDate(day.date)}
                      </time>
                    </div>
                    <ArrowRightIcon
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-6">
                    {day.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {day.primaryGoal}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{day.overnight.place}</span>
                    {itinerary?.driveMinutesEstimate ? (
                      <span>
                        {formatDriveTime(itinerary.driveMinutesEstimate)}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}
function QuickFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-emerald-700 dark:text-emerald-400">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
