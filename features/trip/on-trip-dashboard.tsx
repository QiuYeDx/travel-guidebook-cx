"use client";

import Link from "next/link";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BatteryChargingIcon,
  BedDoubleIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  CloudOffIcon,
  GaugeIcon,
  MapPinnedIcon,
  NavigationIcon,
  RouteIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { CopyAction } from "@/features/navigation/copy-action";
import { createAmapSearchUrl } from "@/lib/navigation/map-links";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import {
  formatDriveTime,
  formatNumberRange,
  formatTripDate,
  intensityLabels,
} from "../itinerary/formatters";
import { buildDayItinerary } from "../itinerary/itinerary-model";
import { useTripMode } from "./trip-mode-provider";

const relationLabels = {
  before: "当前日期在行程前，自动定位 D0",
  during: "按中国标准时间定位今天",
  after: "行程日期已结束，自动定位 D9",
} as const;

export function OnTripDashboard({
  trip,
  scenicCatalog,
}: {
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
  const {
    selectedDayId,
    setSelectedDayId,
    followCurrentDate,
    isManualDay,
    clock,
    storageStatus,
  } = useTripMode();
  const itinerary = buildDayItinerary(trip, scenicCatalog, selectedDayId);
  if (!itinerary) return null;

  const { day } = itinerary;
  const dayIndex = trip.days.findIndex((item) => item.id === day.id);
  const previousDay = trip.days[dayIndex - 1];
  const nextDay = trip.days[dayIndex + 1];
  const primaryLeg = day.legs[0];
  const hasScenicPlan = scenicCatalog.dayPlans.some(
    (plan) => plan.dayId === day.id,
  );
  const risks = [...day.fallbackTriggers].sort((a, b) => {
    const rank = { stop: 0, "switch-plan": 1, warning: 2 } as const;
    return rank[a.severity] - rank[b.severity];
  });
  const timeBoundary = day.fallbackTriggers.find(
    (trigger) => trigger.category === "time",
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-9">
      {storageStatus === "unavailable" ? (
        <SmoothCorners asChild radius={12} smoothing={0.68}>
          <div
            className="mb-5 flex items-start gap-3 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
            role="status"
          >
            <CloudOffIcon
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            模式和手动日期只能在本页临时使用，刷新后可能恢复默认值。
          </div>
        </SmoothCorners>
      ) : null}

      <SmoothCorners asChild radius={16} smoothing={0.72}>
        <section
          className="overflow-hidden bg-[#17231d] text-white dark:bg-[#101914]"
          aria-labelledby="today-title"
        >
          <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <NavigationIcon className="size-4" aria-hidden="true" />
                行中执行 ·{" "}
                {isManualDay ? "手动日期" : relationLabels[clock.relation]}
              </p>
              <h1
                id="today-title"
                className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl"
              >
                {day.id} · {day.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {formatTripDate(day.date)} · 今日唯一主目标：{day.primaryGoal}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <dt className="text-xs text-white/55">驾驶强度</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {intensityLabels[day.intensity]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">当晚落脚</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {day.overnight.place}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </SmoothCorners>

      <section aria-label="手动切换行程日期" className="mt-4 border-y py-3">
        <div className="min-w-0 text-center">
          <ResponsiveTabs
            value={day.id}
            ariaLabel="选择执行日期"
            items={trip.days.map((item) => ({
              value: item.id,
              label: item.id,
            }))}
            onValueChange={setSelectedDayId}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {isManualDay ? "已覆盖手机日期" : relationLabels[clock.relation]}
          </p>
          {isManualDay ? (
            <button
              type="button"
              onClick={followCurrentDate}
              className="mt-1 text-xs font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-400"
            >
              恢复跟随日期
            </button>
          ) : null}
        </div>
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-14">
        <div className="space-y-9">
          <section aria-labelledby="next-leg-title">
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <RouteIcon className="size-4" aria-hidden="true" />
                  下一段
                </p>
                <h2 id="next-leg-title" className="mt-1 text-xl font-semibold">
                  {primaryLeg
                    ? `${primaryLeg.from} → ${primaryLeg.to}`
                    : "当天无公路路线"}
                </h2>
              </div>
              {primaryLeg ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={createAmapSearchUrl(primaryLeg.to)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      高德查终点
                      <ArrowUpRightIcon aria-hidden="true" />
                    </a>
                  </Button>
                  <CopyAction text={primaryLeg.to} label="复制终点" />
                </div>
              ) : null}
            </div>
            {primaryLeg ? (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">途经</p>
                  <p className="mt-1 font-medium">
                    {primaryLeg.via.join(" · ") || "直达"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">规划距离</p>
                  <p className="mt-1 font-medium tabular-nums">
                    {formatNumberRange(itinerary.distanceKmEstimate, "km")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">纯驾驶估算</p>
                  <p className="mt-1 font-medium tabular-nums">
                    {formatDriveTime(itinerary.driveMinutesEstimate)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                当前日没有可生成的公路导航，按当天景区或住宿安排执行。
              </p>
            )}
          </section>

          <section aria-labelledby="risk-actions-title">
            <div className="flex items-center gap-3 border-b pb-4">
              <ShieldAlertIcon
                className="size-5 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                  风险 / 复核警告
                </p>
                <h2
                  id="risk-actions-title"
                  className="mt-1 text-xl font-semibold"
                >
                  触发就执行，不临场讨价还价
                </h2>
              </div>
            </div>
            {risks.length > 0 ? (
              <ul className="divide-y">
                {risks.slice(0, 3).map((risk) => (
                  <li
                    key={risk.id}
                    className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "w-fit",
                        risk.severity === "stop"
                          ? "border-red-300 text-red-700 dark:border-red-800 dark:text-red-400"
                          : "border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-300",
                      )}
                    >
                      <AlertTriangleIcon aria-hidden="true" />
                      {risk.severity === "stop"
                        ? "停止"
                        : risk.severity === "switch-plan"
                          ? "切换方案"
                          : "立即取舍"}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium leading-6">
                        {risk.condition}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {risk.action}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm leading-6 text-muted-foreground">
                当天没有单独触发器，仍执行全队高反、驾驶和天气停止规则。
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-7 lg:sticky lg:top-20 lg:self-start">
          <section
            className="border-l-2 border-emerald-600 pl-4"
            aria-labelledby="energy-title"
          >
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <BatteryChargingIcon className="size-4" aria-hidden="true" />
              补能
            </p>
            <h2 id="energy-title" className="mt-2 text-lg font-semibold">
              {primaryLeg?.targetArrivalSoc
                ? `目标到达 ≥ ${primaryLeg.targetArrivalSoc}%`
                : "当日无公路到达电量目标"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              主站、备站和实时可用性必须在前一晚及出发前通过车机 / 车辆 App
              复核。
            </p>
          </section>

          <section className="border-t pt-6" aria-labelledby="arrival-title">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarClockIcon className="size-4" aria-hidden="true" />
              最晚到达
            </p>
            <h2 id="arrival-title" className="mt-2 text-base font-semibold">
              {timeBoundary
                ? "触发条件出现前完成到店"
                : "以前一晚确认的日照窗口为准"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {timeBoundary?.condition ??
                "山区不为增加景点进入夜间赶路；日照或成员状态收紧时直接结束可选停靠。"}
            </p>
          </section>

          <section className="border-t pt-6" aria-labelledby="lodging-title">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <BedDoubleIcon className="size-4" aria-hidden="true" />
              住宿
            </p>
            <h2 id="lodging-title" className="mt-2 text-lg font-semibold">
              {day.overnight.place}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <GaugeIcon className="size-4" aria-hidden="true" />
              {day.overnight.altitudeMEstimate
                ? `${day.overnight.altitudeMEstimate[0]}-${day.overnight.altitudeMEstimate[1]} m 规划估算`
                : "海拔待复核"}
            </p>
          </section>

          <section className="grid gap-2 border-t pt-6" aria-label="当天操作">
            <Button asChild>
              <Link href={`/days/${day.id}`}>
                <MapPinnedIcon aria-hidden="true" />
                当天完整路书
              </Link>
            </Button>
            {hasScenicPlan ? (
              <Button asChild variant="outline">
                <Link href={`/scenic?day=${day.id}`}>
                  <CheckCircle2Icon aria-hidden="true" />
                  当天观景顺序
                </Link>
              </Button>
            ) : null}
          </section>
        </aside>
      </div>

      <nav
        aria-label="前后日快速切换"
        className="mt-10 grid gap-2 border-t pt-6 sm:grid-cols-2"
      >
        <div>
          {previousDay ? (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedDayId(previousDay.id)}
            >
              <ArrowLeftIcon aria-hidden="true" />
              {previousDay.id} · {previousDay.title}
            </Button>
          ) : null}
        </div>
        <div>
          {nextDay ? (
            <Button
              variant="ghost"
              className="w-full justify-end"
              onClick={() => setSelectedDayId(nextDay.id)}
            >
              {nextDay.id} · {nextDay.title}
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
