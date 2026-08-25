"use client";

import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ScenicItem, Viewpoint } from "@/lib/trip/types";
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

export function ScenicItemList({
  items,
  selectedId,
  onSelect,
}: {
  items: ScenicItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ol className="divide-y border-y">
      {items.map((item, index) => {
        const corridor = isScenicCorridor(item);
        const Icon = corridor ? RouteIcon : kindIcons[item.kind];
        const selected = selectedId === item.id;
        return (
          <li key={item.id} id={`scenic-list-${item.id}`}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(item.id)}
              className={cn(
                "grid min-h-28 w-full gap-3 px-2 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:outline-none sm:grid-cols-[2rem_minmax(0,1fr)_8rem] sm:px-3",
                selected
                  ? "bg-emerald-50 dark:bg-emerald-950/25"
                  : "hover:bg-accent/70",
              )}
            >
              <span className="flex items-center gap-2 sm:block">
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="size-4 text-emerald-700 dark:text-emerald-400 sm:mt-2"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold leading-6">
                    {item.title}
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
                </span>
                <span className="mt-2 block text-sm leading-6 text-foreground/75">
                  {corridor ? item.passengerCue : item.parking.note}
                </span>
                <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {item.subjects.slice(0, 4).map((subject) => (
                    <span key={subject}>{scenicSubjectLabels[subject]}</span>
                  ))}
                </span>
              </span>
              <span className="text-xs leading-5 text-muted-foreground sm:text-right">
                <span className="block font-medium text-foreground/75">
                  {scenicParkingLabels[item.parking.level]}
                </span>
                <span className="mt-1 block">{item.id}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
