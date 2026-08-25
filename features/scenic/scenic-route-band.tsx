"use client";

import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
} from "lucide-react";

import type { ScenicItem, Viewpoint } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { scenicKindLabels, scenicParkingLabels } from "./scenic-labels";
import { isScenicCorridor } from "./scenic-model";

const kindIcons = {
  viewpoint: CameraIcon,
  "scenic-shuttle": BusFrontIcon,
  "town-stop": CarFrontIcon,
  candidate: MapPinIcon,
} satisfies Record<Viewpoint["kind"], typeof CameraIcon>;

export function ScenicRouteBand({
  items,
  selectedId,
  onSelect,
}: {
  items: ScenicItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="border-y py-5 text-sm leading-6 text-muted-foreground">
        当前筛选没有可显示的路线节点。
      </p>
    );
  }

  return (
    <ol className="relative flex gap-3 overflow-x-auto pb-3 before:absolute before:top-5 before:right-6 before:left-6 before:h-px before:bg-border lg:flex-col lg:overflow-visible lg:pb-0 lg:before:top-6 lg:before:right-auto lg:before:bottom-6 lg:before:left-5 lg:before:h-auto lg:before:w-px">
      {items.map((item, index) => {
        const corridor = isScenicCorridor(item);
        const Icon = corridor ? RouteIcon : kindIcons[item.kind];
        const selected = item.id === selectedId;
        return (
          <li key={item.id} className="relative z-10 w-48 shrink-0 lg:w-full">
            <button
              id={`scenic-route-${item.id}`}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex min-h-24 w-full items-start gap-3 rounded-md border bg-background p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:min-h-20",
                corridor && "border-dashed",
                selected
                  ? "border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/25"
                  : "hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-emerald-700 dark:text-emerald-400",
                  corridor && "rounded border-dashed",
                  selected && "border-emerald-700 dark:border-emerald-500",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")} · {item.id}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-5">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {corridor ? "车览走廊" : scenicKindLabels[item.kind]} ·{" "}
                  {scenicParkingLabels[item.parking.level]}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
