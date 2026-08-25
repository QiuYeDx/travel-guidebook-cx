"use client";

import { type ReactNode } from "react";
import { NavigationIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";

import { OnTripDashboard } from "./on-trip-dashboard";
import { useTripMode } from "./trip-mode-provider";

export function TripHome({
  planningView,
  trip,
  scenicCatalog,
}: {
  planningView: ReactNode;
  trip: Trip;
  scenicCatalog: ScenicCatalog;
}) {
  const { mode, clock, setMode } = useTripMode();

  if (mode === "onTrip") {
    return <OnTripDashboard trip={trip} scenicCatalog={scenicCatalog} />;
  }

  return (
    <>
      {clock.relation === "during" ? (
        <div className="border-b border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/25">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-sm text-emerald-950 dark:text-emerald-100">
              <NavigationIcon className="size-4" aria-hidden="true" />
              当前日期处于行程窗口，可切换到行中执行视图。
            </p>
            <Button size="sm" onClick={() => setMode("onTrip")}>
              进入行中模式
            </Button>
          </div>
        </div>
      ) : null}
      {planningView}
    </>
  );
}
