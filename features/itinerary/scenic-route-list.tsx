import {
  BusFrontIcon,
  CameraIcon,
  CarFrontIcon,
  MapPinIcon,
  RouteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ScenicCorridor, ScenicItem, Viewpoint } from "@/lib/trip/types";

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
      <p className="rounded-xl border bg-card p-5 text-sm leading-6 text-muted-foreground">
        当日没有公路观景目录；按集结、景区交通或返程主目标执行。
      </p>
    );
  }

  const visibleItems = compact ? items.slice(0, 6) : items;

  return (
    <div>
      <ol className="grid gap-3">
        {visibleItems.map((item, index) => {
          const corridor = isCorridor(item);
          const Icon = corridor ? RouteIcon : kindIcons[item.kind];
          const title = (
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold leading-6">{item.title}</h3>
              <Badge variant="outline">
                {corridor ? "车览走廊" : viewpointKindLabels[item.kind]}
              </Badge>
              {item.priority === "core" ? (
                <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
                  核心
                </Badge>
              ) : null}
            </div>
          );
          const details = (
            <div className="min-w-0">
              {corridor && item.geoRef.kind === "route-interval" ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  {item.geoRef.fromLabel} → {item.geoRef.toLabel}
                </p>
              ) : null}
              <p
                className={
                  corridor && item.geoRef.kind === "route-interval"
                    ? "mt-1 text-sm leading-6 text-foreground/80"
                    : "text-sm leading-6 text-foreground/80"
                }
              >
                {getItemDescription(item)}
              </p>
            </div>
          );

          if (compact) {
            return (
              <li
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-xl border bg-card p-4 sm:p-5"
                key={item.id}
              >
                <span className="pt-0.5 font-mono text-xs leading-6 tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {title}
                <Icon
                  className="mt-0.5 size-4 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                {details}
              </li>
            );
          }

          return (
            <li
              className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem] sm:p-5"
              key={item.id}
            >
              <div className="flex flex-col items-center gap-2 pt-0.5">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="size-4 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                {title}
                <div className="mt-2">{details}</div>
              </div>
              <div className="text-xs leading-5 text-muted-foreground sm:text-right">
                <p className="font-medium text-foreground/75">
                  {parkingLabels[item.parking.level]}
                </p>
                <p className="mt-1">
                  {item.parking.verificationStatus === "verified"
                    ? "已复核"
                    : "待确认"}
                </p>
              </div>
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
