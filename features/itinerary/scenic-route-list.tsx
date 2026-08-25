import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ScenicCorridor, ScenicItem, Viewpoint } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { parkingLabels, viewpointKindLabels } from "./formatters";

const kindIcons = {
  viewpoint: CameraIcon,
  "scenic-shuttle": BusFrontIcon,
  "town-stop": CarFrontIcon,
  candidate: MapPinIcon,
} satisfies Record<Viewpoint["kind"], typeof CameraIcon>;

function isCorridor(item: ScenicItem): item is ScenicCorridor {
  return "passengerCue" in item;
}

function getItemDescription(item: ScenicItem): string {
  if (isCorridor(item)) return item.passengerCue;
  return item.parking.note;
}

export function ScenicRouteList({
  items,
  compact = false,
}: {
  items: ScenicItem[];
  compact?: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="border-y py-5 text-sm leading-6 text-muted-foreground">
        当日没有公路观景目录；按集结、景区交通或返程主目标执行。
      </p>
    );
  }

  const visibleItems = compact ? items.slice(0, 6) : items;

  return (
    <div>
      <ol className="divide-y border-y">
        {visibleItems.map((item, index) => {
          const corridor = isCorridor(item);
          const Icon = corridor ? RouteIcon : kindIcons[item.kind];
          return (
            <li
              className={cn(
                "grid gap-3 py-4",
                compact
                  ? "sm:grid-cols-[2rem_minmax(0,1fr)]"
                  : "sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem]",
              )}
              key={item.id}
            >
              <div className="flex items-start gap-2 sm:block">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="mt-0.5 size-4 text-emerald-700 dark:text-emerald-400 sm:mt-2"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold leading-6">
                    {item.title}
                  </h3>
                  <Badge variant="outline">
                    {corridor ? "车览走廊" : viewpointKindLabels[item.kind]}
                  </Badge>
                  {item.priority === "core" ? (
                    <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
                      核心
                    </Badge>
                  ) : null}
                </div>
                {corridor && item.geoRef.kind === "route-interval" ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.geoRef.fromLabel} → {item.geoRef.toLabel}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  {getItemDescription(item)}
                </p>
              </div>
              {!compact ? (
                <div className="text-xs leading-5 text-muted-foreground sm:text-right">
                  <p className="font-medium text-foreground/75">
                    {parkingLabels[item.parking.level]}
                  </p>
                  <p className="mt-1">
                    {item.parking.verificationStatus === "verified"
                      ? "已复核"
                      : "D-7 / D-3 复核"}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {compact && items.length > visibleItems.length ? (
        <p className="mt-3 text-xs text-muted-foreground">
          另有 {items.length - visibleItems.length} 个候选点在完整观景清单中。
        </p>
      ) : null}
    </div>
  );
}
