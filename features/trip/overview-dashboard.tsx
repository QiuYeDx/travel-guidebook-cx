import type { CSSProperties } from "react";
import Link from "next/link";
import { smoothCorners } from "@qiuyedx/smooth-corners";
import {
  ArrowRightIcon,
  BedDoubleIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  Clock3Icon,
  GaugeIcon,
  MapPinnedIcon,
  MoonStarIcon,
  MountainSnowIcon,
  RouteIcon,
  ShieldAlertIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  ScenicCatalog,
  StargazingPlan,
  Trip,
  TripDay,
} from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { buildDayItinerary } from "../itinerary/itinerary-model";
import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "../itinerary/formatters";

const overviewSurfaceCorners = smoothCorners(16, 0.72) as CSSProperties;
const daySectionCorners = smoothCorners(14, 0.7) as CSSProperties;

export function OverviewDashboard({
  trip,
  scenicCatalog,
}: {
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
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
  const heavyDays = trip.days.filter(
    (day) => day.intensity === "medium-high",
  ).length;
  const overnightAltitudes = trip.days
    .slice(0, -1)
    .flatMap((day) => day.overnight.altitudeMEstimate ?? []);
  const highestOvernight = Math.max(...overnightAltitudes);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-7 sm:px-6 sm:pt-10">
      <section
        className="smooth-corners overflow-hidden border bg-card shadow-sm"
        style={overviewSurfaceCorners}
      >
        <div className="grid gap-8 border-b border-border bg-gradient-to-br from-emerald-50 via-background to-background px-5 py-7 text-foreground dark:from-emerald-950/45 dark:via-background dark:to-background sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-col items-start gap-3">
              <Badge
                className="border-emerald-200/80 bg-emerald-100/70 text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/55 dark:text-emerald-100"
                variant="outline"
              >
                2026 · 9/29 — 10/5 · 成都闭环
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
                川西大环线 · 7 天
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              北进东出，经四姑娘山、丹巴、塔公与稻城亚丁，把鱼子西观星留在返程前夜；只有
              D3 是重负荷赶路日。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/guidebook">
                  阅读完整攻略 <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-background/70">
                <Link href="/itinerary">
                  打开行程工具 <CalendarDaysIcon aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Metric label="行程" value={`${trip.days.length} 天 6 晚`} />
            <Metric
              label="公路里程"
              value={formatNumberRange(distance, "km")}
            />
            <Metric label="重负荷日" value={`${heavyDays} 天 · D3`} />
            <Metric label="观星主夜" value="10/4 · 鱼子西" />
          </dl>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-8">
          <QuickFact
            icon={<BedDoubleIcon />}
            label="住宿海拔"
            value={`6 晚最高约 ${highestOvernight} m`}
          />
          <QuickFact
            icon={<MountainSnowIcon />}
            label="完整游览"
            value="D4 · 稻城亚丁短线"
          />
          <QuickFact
            icon={<SparklesIcon />}
            label="路线节奏"
            value="D2 早睡 · D6 观星"
          />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="daily-overview-title">
        <div className="grid gap-3 border-b pb-5 sm:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              不用跳转，也能看完整
            </p>
            <h2
              id="daily-overview-title"
              className="mt-1 text-2xl font-semibold sm:text-3xl"
            >
              七天行程一页读完
            </h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground sm:text-right">
            车程、海拔和月出均为规划估算；道路、天气、预约与停车在 D-7、D-3
            和每天前一晚复核。
          </p>
        </div>

        <ol className="mt-6 space-y-5">
          {trip.days.map((day) => {
            const itinerary = buildDayItinerary(trip, scenicCatalog, day.id);
            return (
              <li key={day.id}>
                <DayOverview day={day} itinerary={itinerary} />
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10 grid gap-4 border-t pt-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">还需要更细的执行信息？</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            完整攻略收录预约、道路、观星器材与停止条件；观景目录保留停车复核语义。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/scenic">
              <MapPinnedIcon aria-hidden="true" />
              {scenicCatalog.items.length} 处沿途观景
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/guidebook">
              完整路书 <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function DayOverview({
  day,
  itinerary,
}: {
  day: TripDay;
  itinerary: ReturnType<typeof buildDayItinerary>;
}) {
  const altitude = day.altitudeProfile;
  const overnightAltitude = day.overnight.altitudeMEstimate;
  const primaryWarning = day.fallbackTriggers[0];

  return (
    <article
      className="smooth-corners overflow-hidden border bg-card"
      style={daySectionCorners}
      aria-labelledby={`${day.id}-overview-title`}
    >
      <header className="grid gap-4 border-b bg-muted/25 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-700 text-white hover:bg-emerald-700 dark:bg-emerald-600">
              {day.id}
            </Badge>
            <time
              className="text-xs font-medium text-muted-foreground"
              dateTime={day.date}
            >
              {formatTripDate(day.date)} · {day.lunarDate}
            </time>
            <Badge variant="outline">强度 {intensityLabels[day.intensity]}</Badge>
          </div>
          <h3
            id={`${day.id}-overview-title`}
            className="mt-3 text-lg font-semibold leading-7 sm:text-xl"
          >
            {day.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {day.primaryGoal}
          </p>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground lg:max-w-64">
          <RouteIcon
            className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          />
          <span>{day.legs[0]?.via.join(" · ") || "园区交通与步行"}</span>
        </div>
      </header>

      <dl className="grid grid-cols-2 border-b sm:grid-cols-4">
        <DayMetric
          icon={<CarFrontIcon />}
          label="里程"
          value={
            itinerary?.distanceKmEstimate
              ? formatNumberRange(itinerary.distanceKmEstimate, "km")
              : "园区交通"
          }
        />
        <DayMetric
          icon={<Clock3Icon />}
          label="车程"
          value={
            itinerary?.driveMinutesEstimate
              ? formatDriveTime(itinerary.driveMinutesEstimate)
              : "徒步约 3 km"
          }
        />
        <DayMetric
          icon={<GaugeIcon />}
          label="海拔"
          value={`${altitude.startM} → ${altitude.endM} m`}
          note={altitude.peakM ? `最高约 ${altitude.peakM} m` : undefined}
        />
        <DayMetric
          icon={<BedDoubleIcon />}
          label="住哪里"
          value={day.overnight.place}
          note={
            overnightAltitude
              ? `约 ${Math.round((overnightAltitude[0] + overnightAltitude[1]) / 2)} m`
              : undefined
          }
        />
      </dl>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.65fr)]">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            当日时间轴
          </p>
          <ol className="mt-4 space-y-0">
            {day.timeline.map((item, index) => (
              <li
                key={`${item.time}-${item.title}`}
                className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-3"
              >
                <time className="pt-0.5 font-mono text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {item.time}
                </time>
                <div
                  className={cn(
                    "relative border-l pb-4 pl-4",
                    index === day.timeline.length - 1 && "pb-0",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -left-[4.5px] top-1 size-2 rounded-full ring-4 ring-card",
                      item.tone === "key"
                        ? "bg-emerald-600"
                        : item.tone === "rest"
                          ? "bg-sky-500"
                          : "bg-muted-foreground/55",
                    )}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold leading-5">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-5 border-t bg-muted/15 px-5 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0">
          <StargazingSummary plan={day.stargazing} />
          <div className="border-t pt-5">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldAlertIcon className="size-4" aria-hidden="true" />
              当日最重要提醒
            </p>
            <p className="mt-2 text-sm font-medium leading-6">
              {primaryWarning?.condition ?? "以当天道路、天气与成员状态为准。"}
            </p>
            {primaryWarning ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {primaryWarning.action}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </article>
  );
}

function StargazingSummary({ plan }: { plan: StargazingPlan }) {
  const labels = {
    primary: "主观星夜",
    optional: "可选观星",
    rest: "今晚休息",
    none: "不安排观星",
  } satisfies Record<StargazingPlan["status"], string>;

  return (
    <section aria-label="观星安排">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <MoonStarIcon className="size-4" aria-hidden="true" />
        观星 · {labels[plan.status]}
      </p>
      <h4 className="mt-2 text-base font-semibold">{plan.title}</h4>
      {plan.moonriseApprox ? (
        <p className="mt-2 text-xs font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
          参考月出 {plan.moonriseApprox}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {plan.note}
      </p>
    </section>
  );
}

function DayMetric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="min-w-0 border-r border-t-0 px-4 py-4 first:border-l-0 even:border-r-0 sm:even:border-r sm:last:border-r-0">
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-emerald-700 dark:text-emerald-400">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold leading-5 tabular-nums">
        {value}
      </dd>
      {note ? (
        <dd className="mt-1 text-xs leading-5 text-muted-foreground">{note}</dd>
      ) : null}
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
