import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarRangeIcon,
  CarFrontIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { formatTripDate } from "./formatters";
import { buildDayItinerary } from "./itinerary-model";
import { ScenicRouteList } from "./scenic-route-list";

export function ScenicDayIndex({
  trip,
  catalog,
  selectedDayId,
}: {
  trip: Trip;
  catalog: ScenicCatalog;
  selectedDayId: string;
}) {
  const availableDays = trip.days.filter((day) =>
    catalog.dayPlans.some((plan) => plan.dayId === day.id),
  );
  const selectedDay =
    availableDays.find((day) => day.id === selectedDayId) ?? availableDays[0];
  const itinerary = buildDayItinerary(trip, catalog, selectedDay.id);

  if (!itinerary) return null;

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
        <span className="text-foreground">沿途观景</span>
      </nav>

      <header className="mt-6 border-b pb-7">
        <Badge variant="secondary">只读路线清单</Badge>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          主线 A 沿途观景
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          按每日真实行驶顺序查看停靠点、景交站和连续车览走廊。停车等级是计划边界，不代表国庆期间一定开放或有车位。
        </p>
      </header>

      <nav aria-label="选择观景日程" className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-1 rounded-md border p-1">
          {availableDays.map((day) => (
            <Link
              key={day.id}
              href={`/scenic?day=${day.id}`}
              aria-current={day.id === selectedDay.id ? "page" : undefined}
              className={cn(
                "flex h-10 min-w-16 items-center justify-center rounded px-3 text-sm font-medium transition-colors",
                day.id === selectedDay.id
                  ? "bg-emerald-700 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {day.id}
            </Link>
          ))}
        </div>
      </nav>

      <section className="mt-5 rounded-md bg-[#17231d] px-5 py-5 text-white dark:bg-[#111a16] sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-emerald-200">
              <CalendarRangeIcon className="size-4" aria-hidden="true" />
              {selectedDay.id} · {formatTripDate(selectedDay.date)}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-7">
              {selectedDay.title}
            </h2>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/days/${selectedDay.id}`}>
              <ArrowLeftIcon aria-hidden="true" />
              返回每日页
            </Link>
          </Button>
        </div>
        <dl className="mt-5 grid gap-4 border-t border-white/15 pt-4 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-2 text-xs text-white/55">
              <CarFrontIcon className="size-3.5" aria-hidden="true" />
              停车拍照预算
            </dt>
            <dd className="mt-1 text-sm font-medium">
              {itinerary.parkingBudgetLabel}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs text-white/55">
              <RouteIcon className="size-3.5" aria-hidden="true" />
              当日取舍规则
            </dt>
            <dd className="mt-1 text-sm leading-6 text-white/75">
              {itinerary.scenicPlan?.note}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="scenic-list-title" className="py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              共 {itinerary.scenicItems.length} 个条目
            </p>
            <h2 id="scenic-list-title" className="mt-1 text-xl font-semibold">
              当日路线顺序
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <ScenicRouteList items={itinerary.scenicItems} />
        </div>
      </section>
    </div>
  );
}
