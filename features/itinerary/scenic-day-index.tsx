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
        <Badge variant="secondary">按行驶顺序</Badge>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
          沿途观景
        </h1>
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
            <dt className="flex items-center gap-2 text-xs text-white/55"><CarFrontIcon className="size-3.5" aria-hidden="true" />当日观景条目</dt>
            <dd className="mt-1 text-sm font-medium">{itinerary.scenicItems.length} 处</dd>
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

      <ScenicWorkspace
        dayId={selectedDay.id}
        items={itinerary.scenicItems}
        sources={sources}
        initialSelectedItemId={selectedItemId}
      />
    </div>
  );
}
