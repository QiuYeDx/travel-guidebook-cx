"use client";

import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ParkingLevel, ScenicItem, Viewpoint } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import {
  scenicKindLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
  scenicSubjectLabels,
} from "./scenic-labels";
import { isScenicCorridor } from "./scenic-model";

const kindIcons = {
  viewpoint: CameraIcon,
  "scenic-shuttle": BusFrontIcon,
  "town-stop": CarFrontIcon,
  candidate: MapPinIcon,
} satisfies Record<Viewpoint["kind"], typeof CameraIcon>;

const parkingToneClasses = {
  P0: "bg-emerald-50 text-emerald-800 ring-emerald-200/80 dark:bg-emerald-950/55 dark:text-emerald-300 dark:ring-emerald-800/80",
  P1: "bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-950/45 dark:text-amber-300 dark:ring-amber-800/80",
  P2: "bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-950/45 dark:text-amber-300 dark:ring-amber-800/80",
  prohibited: "bg-red-50 text-red-700 ring-red-200/80 dark:bg-red-950/45 dark:text-red-300 dark:ring-red-900/80",
  "transit-only": "bg-sky-50 text-sky-800 ring-sky-200/80 dark:bg-sky-950/45 dark:text-sky-300 dark:ring-sky-900/80",
  "walk-only": "bg-muted text-foreground/75 ring-border",
} satisfies Record<ParkingLevel, string>;

export function ScenicItemList({
  items,
  onSelect,
}: {
  items: ScenicItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <ol className="grid gap-4 lg:grid-cols-2">
      {items.map((item, index) => {
        const corridor = isScenicCorridor(item);
        const Icon = corridor ? RouteIcon : kindIcons[item.kind];
        const ParkingIcon = item.parking.level === "P0" ? ShieldCheckIcon : ShieldAlertIcon;
        return (
          <li key={item.id} id={`scenic-list-${item.id}`} className="h-full min-w-0">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => onSelect(item.id)}
              className="group flex h-full w-full cursor-pointer flex-col gap-4 rounded-2xl border border-border/65 bg-card p-4 text-left shadow-xs transition-[border-color,background-color,box-shadow,transform] duration-150 hover:border-emerald-600/35 hover:bg-emerald-50/20 hover:shadow-sm focus-visible:border-emerald-600/50 focus-visible:ring-2 focus-visible:ring-emerald-600/20 focus-visible:outline-none active:scale-[0.995] dark:hover:border-emerald-500/35 dark:hover:bg-emerald-950/15 sm:p-5"
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge variant="outline">
                      {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
                    </Badge>
                    <Badge
                      variant={item.priority === "core" ? "default" : "secondary"}
                      className={
                        item.priority === "core"
                          ? "bg-emerald-700 text-white hover:bg-emerald-700"
                          : undefined
                      }
                    >
                      {scenicPriorityLabels[item.priority]}
                    </Badge>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold leading-7 sm:text-xl">
                    {item.title}
                  </h3>
                </div>
                <Icon
                  className="size-6 shrink-0 text-foreground/80 dark:text-foreground/75"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm leading-6 text-foreground/75">
                  {corridor ? item.passengerCue : item.parking.note}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {item.subjects.slice(0, 4).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-muted/70 px-2.5 py-1 text-[11px] leading-4 text-muted-foreground"
                    >
                      {scenicSubjectLabels[subject]}
                    </span>
                  ))}
                  <span
                    className={cn(
                      "ml-auto inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset",
                      parkingToneClasses[item.parking.level],
                    )}
                  >
                    <ParkingIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {scenicParkingLabels[item.parking.level]}
                    </span>
                  </span>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
