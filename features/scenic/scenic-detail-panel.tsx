"use client";

import {
  ArrowUpRightIcon,
  Clock3Icon,
  CompassIcon,
  CornerDownRightIcon,
  MapPinnedIcon,
  ParkingCircleIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createAmapNavigationUrl } from "@/lib/navigation/map-links";
import type { ScenicItem } from "@/lib/trip/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import {
  scenicDirectionLabels,
  scenicKindLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
  scenicVerificationLabels,
} from "./scenic-labels";
import { getParkingNavigationTarget, isScenicCorridor } from "./scenic-model";
import { ScenicSubjectTag } from "./scenic-subject-tag";

function getParkingLevelTone(level: ScenicItem["parking"]["level"]): string {
  switch (level) {
    case "P0":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300";
    case "P1":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300";
    case "prohibited":
      return "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300";
    case "transit-only":
      return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300";
    case "P2":
    case "walk-only":
      return "border-border bg-muted text-foreground/80";
  }
}

function getVerificationTone(
  status: ScenicItem["parking"]["verificationStatus"],
): string {
  switch (status) {
    case "verified":
      return "border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400";
    case "needs-review":
      return "border-border text-muted-foreground";
    case "expired":
      return "border-red-200 text-red-700 dark:border-red-900 dark:text-red-400";
  }
}

function GeoDescription({ item }: { item: ScenicItem }) {
  if (item.geoRef.kind === "route-interval") {
    return (
      <div className="mt-2.5 flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground">
          路线区间
        </span>
        <p className="min-w-0 text-sm font-medium leading-5 text-foreground/85">
          {item.geoRef.fromLabel} → {item.geoRef.toLabel}
        </p>
      </div>
    );
  }
  if (item.geoRef.kind === "exact") {
    return (
      <div className="mt-2.5 flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground">
          精确位置
        </span>
        <p className="min-w-0 text-sm font-medium leading-5 text-foreground/85">
          {item.geoRef.mapQuery}
        </p>
      </div>
    );
  }
  return (
    <div className="mt-2.5 flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-xs font-medium text-amber-700 dark:text-amber-400">
        待核准
      </span>
      <p className="min-w-0 text-sm leading-5 text-foreground/75">
        {item.geoRef.reason}
      </p>
    </div>
  );
}

export function ScenicDetailPanel({
  item,
  index,
  selectedDayId,
  titleId,
  layoutPrefix,
  supportingPhase,
  shouldReduceMotion = false,
}: {
  item?: ScenicItem;
  index: number;
  selectedDayId: string;
  titleId?: string;
  layoutPrefix?: string;
  supportingPhase?: "opening" | "open" | "closing";
  shouldReduceMotion?: boolean | null;
}) {
  if (!item) {
    return (
      <section className="flex h-[34rem] items-center justify-center rounded-2xl border p-6 text-center lg:h-auto lg:min-h-[38rem]">
        <div>
          <RouteIcon
            className="mx-auto size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-semibold">没有匹配的详情</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            清除部分筛选条件后，路线带和详情会重新出现。
          </p>
        </div>
      </section>
    );
  }

  const corridor = isScenicCorridor(item);
  const navigationTarget = getParkingNavigationTarget(item);
  const sharedElementsClosing = Boolean(
    layoutPrefix && supportingPhase === "closing",
  );
  const activeLayoutPrefix = sharedElementsClosing ? undefined : layoutPrefix;

  return (
    <section className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {activeLayoutPrefix ? (
          <motion.span
            layoutId={`${activeLayoutPrefix}-index`}
            layoutCrossfade={false}
            transition={{ type: "spring", duration: 0.48, bounce: 0 }}
            className="font-mono text-xs font-medium tabular-nums text-muted-foreground"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
        ) : (
          <span
            className={cn(
              "font-mono text-xs font-medium tabular-nums text-muted-foreground",
              sharedElementsClosing && "invisible",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {activeLayoutPrefix ? (
          <motion.span
            layoutId={`${activeLayoutPrefix}-kind`}
            layoutCrossfade={false}
            transition={{ type: "spring", duration: 0.48, bounce: 0 }}
            className="inline-flex"
          >
            <Badge variant="outline">
              {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
            </Badge>
          </motion.span>
        ) : (
          <Badge
            variant="outline"
            className={cn(sharedElementsClosing && "invisible")}
          >
            {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
          </Badge>
        )}
        {activeLayoutPrefix ? (
          <motion.span
            layoutId={`${activeLayoutPrefix}-priority`}
            layoutCrossfade={false}
            transition={{ type: "spring", duration: 0.48, bounce: 0 }}
            className="inline-flex"
          >
            <Badge
              className={
                item.priority === "core"
                  ? "bg-emerald-700 text-white hover:bg-emerald-700"
                  : undefined
              }
              variant={item.priority === "core" ? "default" : "secondary"}
            >
              {scenicPriorityLabels[item.priority]}
            </Badge>
          </motion.span>
        ) : (
          <Badge
            className={cn(
              item.priority === "core" &&
                "bg-emerald-700 text-white hover:bg-emerald-700",
              sharedElementsClosing && "invisible",
            )}
            variant={item.priority === "core" ? "default" : "secondary"}
          >
            {scenicPriorityLabels[item.priority]}
          </Badge>
        )}
        {item.dayId !== selectedDayId ? (
          <Badge variant="secondary">源自 {item.dayId} 返程补拍</Badge>
        ) : null}
      </div>

      {activeLayoutPrefix ? (
        <motion.h2
          id={titleId}
          layoutId={`${activeLayoutPrefix}-title`}
          layoutCrossfade={false}
          transition={{ type: "spring", duration: 0.48, bounce: 0 }}
          className="mt-4 text-xl font-semibold leading-7"
          aria-live="polite"
        >
          {item.title}
        </motion.h2>
      ) : (
        <h2
          id={titleId}
          className={cn(
            "mt-4 text-xl font-semibold leading-7",
            sharedElementsClosing && "invisible",
          )}
          aria-live="polite"
        >
          {item.title}
        </h2>
      )}

      <motion.div
        initial={
          supportingPhase === "opening" && !shouldReduceMotion
            ? { opacity: 0, y: 5 }
            : false
        }
        animate={{
          opacity: supportingPhase === "closing" ? 0 : 1,
          y: 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <dl className="mt-5 grid grid-cols-2 divide-x border-y py-3.5 text-sm">
          <div className="pr-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <CompassIcon className="size-3.5" aria-hidden="true" />
              行驶方向
            </dt>
            <dd className="mt-1.5 font-semibold">
              {scenicDirectionLabels[item.direction]}
            </dd>
          </div>
          <div className="pl-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3Icon className="size-3.5" aria-hidden="true" />
              预计停留
            </dt>
            <dd className="mt-1.5 font-semibold tabular-nums">
              {!corridor && item.stayMinutesEstimate
                ? `${item.stayMinutesEstimate[0]}-${item.stayMinutesEstimate[1]} min`
                : "连续车览"}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <MapPinnedIcon
              className="size-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            位置
          </h3>
          <GeoDescription item={item} />
        </div>

        <div className="mt-5 border-t pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ParkingCircleIcon
                className="size-4 text-amber-700 dark:text-amber-400"
                aria-hidden="true"
              />
              停车决策
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "h-6 px-2 text-xs font-medium",
                  getParkingLevelTone(item.parking.level),
                )}
              >
                {scenicParkingLabels[item.parking.level]}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "h-6 px-2 text-xs font-medium",
                  getVerificationTone(item.parking.verificationStatus),
                )}
              >
                {scenicVerificationLabels[item.parking.verificationStatus]}
              </Badge>
            </div>
          </div>

          <p className="mt-3 text-sm font-medium leading-6 text-foreground/90">
            {item.parking.note}
          </p>
          {item.parking.entryDirectionNote || item.parking.capacityNote ? (
            <dl className="mt-3 divide-y border-y text-xs">
              {item.parking.entryDirectionNote ? (
                <div
                  className="grid gap-3 py-2.5"
                  style={{ gridTemplateColumns: "4.5rem minmax(0, 1fr)" }}
                >
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <CornerDownRightIcon
                      className="size-3.5"
                      aria-hidden="true"
                    />
                    进出方向
                  </dt>
                  <dd className="leading-5 text-foreground/75">
                    {item.parking.entryDirectionNote}
                  </dd>
                </div>
              ) : null}
              {item.parking.capacityNote ? (
                <div
                  className="grid gap-3 py-2.5"
                  style={{ gridTemplateColumns: "4.5rem minmax(0, 1fr)" }}
                >
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
                    现场条件
                  </dt>
                  <dd className="leading-5 text-foreground/75">
                    {item.parking.capacityNote}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>

        <div className="relative mt-4 flex flex-wrap gap-1.5 pt-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-border"
          />
          {item.subjects.map((subject) => (
            <ScenicSubjectTag key={subject} subject={subject} />
          ))}
        </div>
      </motion.div>

      {navigationTarget ? (
        <motion.div
          className="mt-6"
          initial={
            supportingPhase === "opening" && !shouldReduceMotion
              ? { opacity: 0, y: 5 }
              : false
          }
          animate={{
            opacity: supportingPhase === "closing" ? 0 : 1,
            y: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.22,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <Button asChild>
            <a
              href={createAmapNavigationUrl(navigationTarget)}
              target="_blank"
              rel="noopener noreferrer"
            >
              导航到停车点
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </Button>
        </motion.div>
      ) : null}
    </section>
  );
}
