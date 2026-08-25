import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BedDoubleIcon,
  CarFrontIcon,
  CheckCircle2Icon,
  Clock3Icon,
  GaugeIcon,
  MapPinIcon,
  RouteIcon,
  ShieldAlertIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAction } from "@/features/navigation/copy-action";
import {
  buildRouteLegCopyText,
  createAmapSearchUrl,
} from "@/lib/navigation/map-links";
import type { TripDay } from "@/lib/trip/types";

import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "./formatters";
import type { DayItinerary } from "./itinerary-model";
import { ScenicRouteList } from "./scenic-route-list";

function DayLink({
  day,
  direction,
}: {
  day: TripDay;
  direction: "previous" | "next";
}) {
  const previous = direction === "previous";
  return (
    <Link
      href={`/days/${day.id}`}
      className="group flex min-h-14 min-w-0 items-center gap-3 rounded-md border px-3 py-2 transition-colors hover:bg-accent focus-visible:bg-accent sm:px-4"
    >
      {previous ? (
        <ArrowLeftIcon
          className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
      <span
        className={previous ? "min-w-0 flex-1" : "min-w-0 flex-1 text-right"}
      >
        <span className="block text-xs text-muted-foreground">
          {previous ? "上一日" : "下一日"} · {day.id}
        </span>
        <span className="block truncate text-sm font-medium">{day.title}</span>
      </span>
      {!previous ? (
        <ArrowRightIcon
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
    </Link>
  );
}

function DayNavigation({ itinerary }: { itinerary: DayItinerary }) {
  return (
    <nav aria-label="前后日切换" className="grid gap-2 sm:grid-cols-2">
      <div>
        {itinerary.previousDay ? (
          <DayLink day={itinerary.previousDay} direction="previous" />
        ) : null}
      </div>
      <div>
        {itinerary.nextDay ? (
          <DayLink day={itinerary.nextDay} direction="next" />
        ) : null}
      </div>
    </nav>
  );
}

function RouteLegs({ itinerary }: { itinerary: DayItinerary }) {
  if (itinerary.day.legs.length === 0) {
    const transitDay = itinerary.scenicPlan?.mode === "scenic-transit";
    return (
      <div className="rounded-md border bg-muted/25 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {transitDay ? (
            <SparklesIcon
              className="size-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <MapPinIcon
              className="size-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
          )}
          {transitDay ? "景区交通日" : "成都集结日"}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {transitDay
            ? "社会车辆不进入核心游览线路，按景区当天观光车、开放站点和步道规则执行。"
            : "当日不生成公路导航，优先完成人车到齐、装载演练、补给和离线信息准备。"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {itinerary.day.legs.map((leg) => (
        <article className="rounded-md border p-5" key={leg.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {leg.id}
              </p>
              <h3 className="mt-1 text-base font-semibold leading-6">
                {leg.from} → {leg.to}
              </h3>
              {leg.via.length > 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  途经：{leg.via.join(" · ")}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href={createAmapSearchUrl(leg.navigationQuery)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  打开高德
                  <ArrowUpRightIcon aria-hidden="true" />
                </a>
              </Button>
              <CopyAction text={buildRouteLegCopyText(leg)} label="复制路线" />
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">规划距离</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {formatNumberRange(leg.distanceKmEstimate, "km")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">纯驾驶估算</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {formatDriveTime(leg.driveMinutesEstimate)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            搜索词：{leg.navigationQuery}
            。未安装地图 App 时使用 Web 页面或复制路线；实际路线以当天车机为准。
          </p>
        </article>
      ))}
    </div>
  );
}

function ActionList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "must" | "optional" | "skip";
}) {
  const meta = {
    must: {
      icon: CheckCircle2Icon,
      color: "text-emerald-700 dark:text-emerald-400",
    },
    optional: {
      icon: SparklesIcon,
      color: "text-amber-700 dark:text-amber-400",
    },
    skip: { icon: XCircleIcon, color: "text-red-600 dark:text-red-400" },
  }[tone];
  const Icon = meta.icon;

  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Icon className={`size-4 ${meta.color}`} aria-hidden="true" />
        {title}
      </h2>
      <ul className="mt-3 divide-y border-y">
        {items.map((item) => (
          <li className="py-3 text-sm leading-6" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DayFacts({ itinerary }: { itinerary: DayItinerary }) {
  const altitude = itinerary.day.overnight.altitudeMEstimate;
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
      <section className="rounded-md border p-5">
        <h2 className="text-sm font-semibold">当晚落脚</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <BedDoubleIcon
              className="mt-0.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs text-muted-foreground">住宿地</dt>
              <dd className="mt-1 font-medium">
                {itinerary.day.overnight.place}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <GaugeIcon
              className="mt-0.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs text-muted-foreground">住宿海拔估算</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {altitude ? `${altitude[0]}-${altitude[1]} m` : "待确认"}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CarFrontIcon
              className="mt-0.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs text-muted-foreground">停车拍照预算</dt>
              <dd className="mt-1 font-medium">
                {itinerary.parkingBudgetLabel}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {itinerary.degradeAction ? (
        <section className="rounded-md border border-amber-300 bg-amber-50/70 p-5 dark:border-amber-800 dark:bg-amber-950/20">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
            <Clock3Icon className="size-4" aria-hidden="true" />
            舍弃规则
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-950/75 dark:text-amber-100/70">
            {itinerary.degradeAction}
          </p>
          {itinerary.scenicPlan ? (
            <p className="mt-2 text-xs leading-5 text-amber-900/65 dark:text-amber-200/60">
              {itinerary.scenicPlan.note}
            </p>
          ) : null}
        </section>
      ) : null}

      <ActionList title="明确不做" items={itinerary.day.skip} tone="skip" />
    </aside>
  );
}

export function DayGuide({ itinerary }: { itinerary: DayItinerary }) {
  const { day } = itinerary;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <nav aria-label="面包屑" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          总览
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <Link href="/itinerary" className="hover:text-foreground">
          行程
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">{day.id}</span>
      </nav>

      <header className="mt-6 border-b pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
            {day.id}
          </Badge>
          <Badge variant="outline">强度 {intensityLabels[day.intensity]}</Badge>
          <time className="text-xs text-muted-foreground" dateTime={day.date}>
            {formatTripDate(day.date)}
          </time>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          {day.title}
        </h1>
      </header>

      <div className="py-5">
        <DayNavigation itinerary={itinerary} />
      </div>

      <section className="rounded-md bg-[#17231d] px-5 py-5 text-white dark:bg-[#111a16] sm:px-6">
        <p className="text-xs font-medium text-emerald-200">当日唯一主目标</p>
        <p className="mt-2 text-xl font-semibold leading-8">
          {day.primaryGoal}
        </p>
        {itinerary.timePriority ? (
          <p className="mt-3 border-t border-white/15 pt-3 text-sm leading-6 text-white/65">
            时限触发：{itinerary.timePriority.condition}；
            {itinerary.timePriority.action}
          </p>
        ) : null}
      </section>

      <div className="grid gap-10 py-9 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="route-title">
            <h2
              id="route-title"
              className="flex items-center gap-2 text-xl font-semibold"
            >
              <RouteIcon
                className="size-5 text-emerald-700 dark:text-emerald-400"
                aria-hidden="true"
              />
              路线与导航上下文
            </h2>
            <div className="mt-4">
              <RouteLegs itinerary={itinerary} />
            </div>
          </section>

          <ActionList title="当天必须完成" items={day.mustDo} tone="must" />
          <ActionList
            title="条件允许再做"
            items={day.optional}
            tone="optional"
          />

          <section
            aria-labelledby="scenic-summary-title"
            id="scenic-summary"
            className="scroll-mt-20"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  按真实行驶顺序
                </p>
                <h2
                  id="scenic-summary-title"
                  className="mt-1 text-xl font-semibold"
                >
                  核心停靠与车览走廊
                </h2>
              </div>
              {itinerary.scenicPlan ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/scenic?day=${day.id}`}>
                    查看当日完整观景清单
                    <ArrowRightIcon aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </div>
            <div className="mt-4">
              <ScenicRouteList items={itinerary.scenicSummary} compact />
            </div>
          </section>

          <section aria-labelledby="fallback-title">
            <h2
              id="fallback-title"
              className="flex items-center gap-2 text-xl font-semibold"
            >
              <ShieldAlertIcon
                className="size-5 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
              当日降级触发
            </h2>
            {day.fallbackTriggers.length > 0 ? (
              <ul className="mt-4 divide-y border-y">
                {day.fallbackTriggers.map((trigger) => (
                  <li className="py-4" key={trigger.id}>
                    <p className="text-sm font-semibold leading-6">
                      {trigger.condition}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {trigger.action}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 border-y py-4 text-sm leading-6 text-muted-foreground">
                当日没有单独触发器；仍执行全程通用的健康、天气、道路和不夜驾规则。
              </p>
            )}
          </section>
        </div>

        <DayFacts itinerary={itinerary} />
      </div>

      <div className="border-t pt-6">
        <DayNavigation itinerary={itinerary} />
      </div>
    </div>
  );
}
