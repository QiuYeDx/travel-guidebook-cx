"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BedDoubleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  GaugeIcon,
  MapPinIcon,
  MapPinnedIcon,
  MoonStarIcon,
  RouteIcon,
  ShieldAlertIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipPathTabs } from "@/components/qiuye-ui/clip-path-tabs";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { TabsContent } from "@/components/ui/tabs";
import { CopyAction } from "@/features/navigation/copy-action";
import { isScenicCorridor } from "@/features/scenic/scenic-model";
import { createAmapSearchUrl } from "@/lib/navigation/map-links";
import type { TripDay } from "@/lib/trip/types";

import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "./formatters";
import type { DayItinerary } from "./itinerary-model";
import {
  buildDayHref,
  buildScenicHref,
  normalizeDayGuideTab,
  type DayGuideTab,
} from "./day-guide-state";

function DayNavigation({
  itinerary,
  selectedTab,
}: {
  itinerary: DayItinerary;
  selectedTab: DayGuideTab;
}) {
  return (
    <nav aria-label="前后日切换" className="grid grid-cols-2 gap-3 md:gap-4">
      {itinerary.previousDay ? (
        <DayLink
          day={itinerary.previousDay}
          direction="previous"
          selectedTab={selectedTab}
        />
      ) : (
        <span aria-hidden="true" />
      )}
      {itinerary.nextDay ? (
        <DayLink
          day={itinerary.nextDay}
          direction="next"
          selectedTab={selectedTab}
        />
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function DayLink({
  day,
  direction,
  selectedTab,
}: {
  day: TripDay;
  direction: "previous" | "next";
  selectedTab: DayGuideTab;
}) {
  const previous = direction === "previous";
  const alignment = previous ? "text-left" : "text-right";
  const routePoints = day.title.split(" → ");
  const firstPoint = routePoints[0];
  const lastPoint = routePoints.at(-1) ?? firstPoint;
  const hasMiddlePoints = routePoints.length > 2;

  return (
    <SmoothCorners asChild radius={10} smoothing={0.68}>
      <Link
        href={buildDayHref(day.id, selectedTab)}
        className={`group flex min-w-0 w-full items-center gap-2 border px-3 py-2 transition-colors hover:bg-accent focus-visible:bg-accent ${alignment}`}
      >
        {previous ? (
          <ArrowLeftIcon
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[0.6875rem] text-muted-foreground">
            {previous ? "上一日" : "下一日"} · {day.id}
          </span>
          <span className="mt-1 block min-w-0 text-sm font-medium">
            <span className="hidden truncate sm:block">{day.title}</span>
            <span
              className={`flex min-w-0 items-center sm:hidden ${previous ? "" : "justify-end"}`}
            >
              {hasMiddlePoints ? (
                <>
                  <span className="shrink-0 whitespace-nowrap">
                    {firstPoint}
                  </span>
                  <span className="shrink-0 px-1" aria-hidden="true">
                    …
                  </span>
                  <span className="shrink-0 whitespace-nowrap">
                    {lastPoint}
                  </span>
                </>
              ) : (
                <span className="min-w-0 truncate">{firstPoint}</span>
              )}
            </span>
          </span>
        </span>
        {!previous ? (
          <ArrowRightIcon
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden="true" />
        )}
      </Link>
    </SmoothCorners>
  );
}

function RoutePanel({ itinerary }: { itinerary: DayItinerary }) {
  const { day } = itinerary;
  if (!day.legs.length)
    return (
      <SmoothCorners asChild radius={12} smoothing={0.7}>
        <div className="border bg-muted/35 p-5">
          <p className="flex items-center gap-2 font-medium">
            <MapPinIcon
              className="size-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            当天无公路路线
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            按当天景区交通、开放站点和住宿安排执行。
          </p>
        </div>
      </SmoothCorners>
    );
  return (
    <div className="space-y-3">
      {day.legs.map((leg) => (
        <SmoothCorners key={leg.id} asChild radius={12} smoothing={0.7}>
          <article className="border p-4 sm:p-5">
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {leg.id}
              </p>
              <h3 className="mt-1 text-base font-semibold">
                {leg.from} → {leg.to}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {leg.via.join(" · ") || "直达"}
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">规划距离</dt>
                <dd className="mt-1 font-medium tabular-nums">
                  {formatNumberRange(leg.distanceKmEstimate, "km")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">纯驾驶</dt>
                <dd className="mt-1 font-medium tabular-nums">
                  {formatDriveTime(leg.driveMinutesEstimate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">最晚到达</dt>
                <dd className="mt-1 font-medium">
                  {leg.latestArrival ?? "按当天车机"}
                </dd>
              </div>
            </dl>
          </article>
        </SmoothCorners>
      ))}
    </div>
  );
}

function RouteStops({ itinerary }: { itinerary: DayItinerary }) {
  const points = itinerary.day.legs.reduce<string[]>((result, leg) => {
    for (const point of [leg.from, ...leg.via, leg.to]) {
      if (result.at(-1) !== point) result.push(point);
    }
    return result;
  }, []);

  if (!points.length) return null;

  return (
    <SmoothCorners asChild radius={12} smoothing={0.7}>
      <section className="border bg-card p-4 sm:p-5">
        <div>
          <p className="text-xs text-muted-foreground">按行驶顺序逐点使用</p>
          <h2 className="mt-1 text-xl font-semibold">路线地点</h2>
        </div>
        <ol className="mt-4 divide-y border-t">
          {points.map((point, index) => {
            const role =
              index === 0
                ? "起点"
                : index === points.length - 1
                  ? "终点"
                  : "途经";

            return (
              <li
                key={`${point}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{point}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {role}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={createAmapSearchUrl(point)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`在高德地图搜索${point}`}
                    >
                      高德 <ArrowUpRightIcon aria-hidden="true" />
                    </a>
                  </Button>
                  <CopyAction text={point} label="复制" />
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </SmoothCorners>
  );
}

function ScenicDaySummary({
  itinerary,
  selectedTab,
}: {
  itinerary: DayItinerary;
  selectedTab: DayGuideTab;
}) {
  const { day, scenicItems } = itinerary;

  if (!scenicItems.length) {
    return (
      <SmoothCorners asChild radius={12} smoothing={0.7}>
        <section className="border bg-card p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">今日观景摘要</p>
          <h2 className="mt-1 text-lg font-semibold">无沿途观景安排</h2>
        </section>
      </SmoothCorners>
    );
  }

  const corridors = scenicItems.filter(isScenicCorridor);
  const coreStops = scenicItems.filter(
    (item) => !isScenicCorridor(item) && item.priority === "core",
  );
  const coreItems = scenicItems.filter((item) => item.priority === "core");
  const highlightedItems = (
    coreItems.length ? coreItems : corridors.length ? corridors : scenicItems
  ).slice(0, 3);
  const highlightedTotal = coreItems.length
    ? coreItems.length
    : corridors.length
      ? corridors.length
      : scenicItems.length;
  const highlightedNames = highlightedItems
    .map((item) => item.title)
    .join("、");
  const highlightedText =
    highlightedTotal > highlightedItems.length
      ? `${highlightedNames}等 ${highlightedTotal} 处`
      : highlightedNames;

  return (
    <SmoothCorners asChild radius={12} smoothing={0.7}>
      <section className="border bg-card p-4 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">路线执行摘要</p>
            <h2 className="mt-1 text-xl font-semibold">今日观景</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={buildScenicHref(day.id, selectedTab)}>
              查看全部 {scenicItems.length} 处
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">核心停靠</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {coreStops.length} 处
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">车览走廊</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {corridors.length} 段
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs text-muted-foreground">停靠预算</dt>
            <dd className="mt-1 font-semibold">
              {itinerary.parkingBudgetLabel}
            </dd>
          </div>
        </dl>

        <div className="mt-3 grid gap-1 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-3">
          <p className="text-xs leading-5 text-muted-foreground">今日重点</p>
          <p className="text-sm font-medium leading-5 text-foreground/85">
            {highlightedText}
          </p>
        </div>
      </section>
    </SmoothCorners>
  );
}

function NoteList({
  title,
  items,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2Icon;
  tone?: "default" | "warning";
}) {
  if (!items.length)
    return (
      <SmoothCorners asChild radius={12} smoothing={0.7}>
        <p className="border p-4 text-sm text-muted-foreground">
          暂无特别说明。
        </p>
      </SmoothCorners>
    );
  return (
    <SmoothCorners asChild radius={12} smoothing={0.7}>
      <section
        className={
          tone === "warning"
            ? "border border-amber-300 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/20"
            : "border p-4"
        }
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Icon
            className="size-4 text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          />
          {title}
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </SmoothCorners>
  );
}

function DayExecutionOverview({ day }: { day: TripDay }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
      <SmoothCorners asChild radius={12} smoothing={0.7}>
        <section className="border p-4 sm:p-5" aria-labelledby="day-timeline-title">
          <p className="text-xs text-muted-foreground">按时间执行</p>
          <h2 id="day-timeline-title" className="mt-1 text-xl font-semibold">
            今日时间轴
          </h2>
          <ol className="mt-4 divide-y border-t">
            {day.timeline.map((item) => (
              <li
                key={`${item.time}-${item.title}`}
                className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-3 py-3"
              >
                <time className="font-mono text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {item.time}
                </time>
                <div>
                  <p className="text-sm font-semibold leading-5">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </SmoothCorners>

      <div className="space-y-3">
        <SmoothCorners asChild radius={12} smoothing={0.7}>
          <section className="border p-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <GaugeIcon className="size-4" aria-hidden="true" />
              当日海拔
            </p>
            <p className="mt-2 text-lg font-semibold tabular-nums">
              {day.altitudeProfile.startM} → {day.altitudeProfile.endM} m
            </p>
            {day.altitudeProfile.peakM ? (
              <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                最高暴露约 {day.altitudeProfile.peakM} m
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {day.altitudeProfile.note}
            </p>
          </section>
        </SmoothCorners>
        <SmoothCorners asChild radius={12} smoothing={0.7}>
          <section className="border p-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <MoonStarIcon className="size-4" aria-hidden="true" />
              观星安排
            </p>
            <p className="mt-2 text-base font-semibold">
              {day.stargazing.title}
            </p>
            {day.stargazing.moonriseApprox ? (
              <p className="mt-1 text-xs font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                参考月出 {day.stargazing.moonriseApprox}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {day.stargazing.note}
            </p>
          </section>
        </SmoothCorners>
      </div>
    </div>
  );
}

export function DayGuide({ itinerary }: { itinerary: DayItinerary }) {
  const { day } = itinerary;
  const [selectedTab, setSelectedTab] = React.useState<DayGuideTab>("overview");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedTab(normalizeDayGuideTab(params.get("tab")));
  }, [day.id]);

  function handleTabChange(value: string) {
    const nextTab = value as DayGuideTab;
    setSelectedTab(nextTab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", nextTab);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${params.toString()}${window.location.hash}`,
    );
  }
  const tabItems = [
    { value: "overview", label: "总览", icon: <MapPinnedIcon /> },
    { value: "route", label: "路线", icon: <RouteIcon /> },
    { value: "notes", label: "注意", icon: <ShieldAlertIcon /> },
  ];
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-7 sm:px-6 sm:pt-10">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
            {day.id}
          </Badge>
          <Badge variant="outline">{formatTripDate(day.date)}</Badge>
          <Badge variant="outline">{day.lunarDate}</Badge>
          <Badge variant="outline">{intensityLabels[day.intensity]}</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          {day.title}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground md:mt-3">
          {day.primaryGoal}
        </p>
      </header>
      <div className="mt-3 md:mt-4">
        <DayNavigation itinerary={itinerary} selectedTab={selectedTab} />
      </div>
      <SmoothCorners asChild radius={16} smoothing={0.72}>
        <section className="mt-3 bg-[#17231d] px-5 py-5 text-white shadow-sm dark:bg-[#111a16] sm:px-7 md:mt-4">
          <p className="text-xs font-medium text-emerald-200">
            今天只记住这一件事
          </p>
          <p className="mt-2 text-xl font-semibold leading-8 sm:text-2xl">
            {day.primaryGoal}
          </p>
          {itinerary.timePriority ? (
            <p className="mt-3 flex items-start gap-2 border-t border-white/15 pt-3 text-sm leading-6 text-white/70">
              <Clock3Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {itinerary.timePriority.condition}：
              {itinerary.timePriority.action}
            </p>
          ) : null}
        </section>
      </SmoothCorners>
      <div className="mt-3 md:mt-4">
        <ClipPathTabs
          items={tabItems}
          value={selectedTab}
          onValueChange={handleTabChange}
          shape="rounded"
          smoothCorners
          transitionMode="continuous"
          className="w-full gap-3 md:gap-4"
        >
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-3 md:space-y-4">
              <DayExecutionOverview day={day} />
              <RoutePanel itinerary={itinerary} />
            </div>
          </TabsContent>
          <TabsContent value="route" className="mt-0">
            <div className="space-y-3 md:space-y-4">
              <RouteStops itinerary={itinerary} />
              <ScenicDaySummary
                itinerary={itinerary}
                selectedTab={selectedTab}
              />
            </div>
          </TabsContent>
          <TabsContent value="notes" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <NoteList
                title="必须完成"
                items={day.mustDo}
                icon={CheckCircle2Icon}
              />
              <NoteList
                title="条件允许再做"
                items={day.optional}
                icon={SparklesIcon}
              />
              <NoteList
                title="当日降级触发"
                items={day.fallbackTriggers.map(
                  (trigger) => `${trigger.condition}：${trigger.action}`,
                )}
                icon={ShieldAlertIcon}
                tone="warning"
              />
              <SmoothCorners asChild radius={12} smoothing={0.7}>
                <section className="border p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <BedDoubleIcon
                      className="size-4 text-emerald-700 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    今晚落脚
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">地点</dt>
                      <dd className="mt-1 font-medium">
                        {day.overnight.place}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        海拔估算
                      </dt>
                      <dd className="mt-1 font-medium tabular-nums">
                        {day.overnight.altitudeMEstimate
                          ? `${day.overnight.altitudeMEstimate[0]}–${day.overnight.altitudeMEstimate[1]} m`
                          : "按现场"}
                      </dd>
                    </div>
                  </dl>
                </section>
              </SmoothCorners>
            </div>
          </TabsContent>
        </ClipPathTabs>
      </div>
    </div>
  );
}
