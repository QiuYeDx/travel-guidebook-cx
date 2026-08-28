"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, Clock3Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { ScenicWorkspace } from "@/features/scenic/scenic-workspace";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "./itinerary-model";
import {
  buildDayHref,
  buildScenicHref,
  type DayGuideTab,
} from "./day-guide-state";

export function ScenicDayIndex({
  trip,
  catalog,
  selectedDayId,
  selectedItemId,
  returnTab,
}: {
  trip: Trip;
  catalog: ScenicCatalog;
  selectedDayId: string;
  selectedItemId?: string;
  returnTab: DayGuideTab;
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
            观景清单
          </h1>
          <Badge className="ml-auto" variant="secondary">
            完整清单
          </Badge>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          按真实行驶顺序整理停靠点、景交站和连续车览走廊。
        </p>
      </header>

      <div>
        <ResponsiveTabs
          value={selectedDay.id}
          ariaLabel="选择观景日程"
          items={availableDays.map((day) => ({
            value: day.id,
            label: day.id,
          }))}
          onValueChange={(value) =>
            router.replace(buildScenicHref(value, returnTab))
          }
        />
      </div>

      <section className="mt-5 rounded-2xl bg-[#17231d] px-5 py-5 text-white shadow-sm dark:bg-[#111a16] sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-200">
              今天只记住这一件事
            </p>
            <p className="mt-2 text-xl font-semibold leading-8 sm:text-2xl">
              {selectedDay.primaryGoal}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href={buildDayHref(selectedDay.id, returnTab)}>
              <ArrowLeftIcon aria-hidden="true" />
              返回 {selectedDay.id} 行程
            </Link>
          </Button>
        </div>
        {itinerary.timePriority ? (
          <p className="mt-3 flex items-start gap-2 border-t border-white/15 pt-3 text-sm leading-6 text-white/70">
            <Clock3Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
            {itinerary.timePriority.condition}：{itinerary.timePriority.action}
          </p>
        ) : null}
      </section>

      <ScenicWorkspace
        key={selectedDay.id}
        dayId={selectedDay.id}
        items={itinerary.scenicItems}
        initialSelectedItemId={selectedItemId}
      />
    </div>
  );
}
