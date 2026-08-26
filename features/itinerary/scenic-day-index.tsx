"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarRangeIcon,
  CarFrontIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { ScenicWorkspace } from "@/features/scenic/scenic-workspace";
import type { ScenicCatalog, SourceRef, Trip } from "@/lib/trip/types";

import { formatTripDate } from "./formatters";
import { buildDayItinerary } from "./itinerary-model";

export function ScenicDayIndex({
  trip,
  catalog,
  sources,
  selectedDayId,
  selectedItemId,
}: {
  trip: Trip;
  catalog: ScenicCatalog;
  sources: SourceRef[];
  selectedDayId: string;
  selectedItemId?: string;
}) {
  const router = useRouter();
  const availableDays = trip.days.filter((day) =>
    catalog.dayPlans.some((plan) => plan.dayId === day.id),
  );
  const selectedDay =
    availableDays.find((day) => day.id === selectedDayId) ?? availableDays[0];
  const itinerary = buildDayItinerary(trip, catalog, selectedDay.id);

  if (!itinerary) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            沿途观景
          </h1>
          <Badge className="ml-auto" variant="secondary">按行驶顺序</Badge>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          按真实行驶顺序查看停靠点、景交站和连续车览走廊，并查看详细停车边界。停车等级不代表国庆期间一定开放或有车位。
        </p>
      </header>

      <div className="mt-6">
        <ResponsiveTabs
          value={selectedDay.id}
          ariaLabel="选择观景日程"
          items={availableDays.map((day) => ({
            value: day.id,
            label: day.id,
          }))}
          onValueChange={(value) => router.replace(`/scenic?day=${value}`)}
        />
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid gap-6 border-b border-border bg-gradient-to-br from-emerald-50 via-background to-background px-5 py-6 text-foreground dark:from-emerald-950/45 dark:via-background dark:to-background sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CalendarRangeIcon className="size-4" aria-hidden="true" />
              {selectedDay.id} · {formatTripDate(selectedDay.date)}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-7">
              {selectedDay.title}
            </h2>
          </div>
          <Button asChild>
            <Link href={`/days/${selectedDay.id}`}>
              <ArrowLeftIcon aria-hidden="true" />
              返回每日页
            </Link>
          </Button>
        </div>
        <dl className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <div>
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <CarFrontIcon className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              当日观景条目
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums">{itinerary.scenicItems.length} 处</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <RouteIcon className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              当日取舍规则
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              {itinerary.scenicPlan?.note}
            </dd>
          </div>
        </dl>
      </section>

      <ScenicWorkspace
        key={selectedDay.id}
        dayId={selectedDay.id}
        items={itinerary.scenicItems}
        sources={sources}
        initialSelectedItemId={selectedItemId}
      />
    </div>
  );
}
