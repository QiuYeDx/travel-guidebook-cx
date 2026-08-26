"use client";

import {
  ArrowUpRightIcon,
  Clock3Icon,
  CompassIcon,
  MapPinnedIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAction } from "@/features/navigation/copy-action";
import {
  buildScenicItemCopyText,
  createAmapNavigationUrl,
} from "@/lib/navigation/map-links";
import type { ScenicItem } from "@/lib/trip/types";

import {
  scenicDirectionLabels,
  scenicKindLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
  scenicSubjectLabels,
  scenicVerificationLabels,
} from "./scenic-labels";
import { getParkingNavigationTarget, isScenicCorridor } from "./scenic-model";

function getParkingAction(item: ScenicItem): string | undefined {
  if (item.parking.level === "prohibited") {
    return "不要为拍照停车，乘客在车上看，驾驶员保持行车节奏。";
  }
  if (item.parking.level === "P2") {
    return "默认直接车览；只有现场有明确停车位置且车辆能完全离开行车道时再停。";
  }
  if (item.parking.level === "transit-only") {
    return "需要乘坐景区交通，私家车不进入。";
  }
  if (item.parking.level === "walk-only") {
    return "按步道规则步行前往，车辆停在允许的位置。";
  }
  if (item.parking.verificationStatus !== "verified") {
    return undefined;
  }
  return "入口已确认，现场满位就直接通过。";
}

function GeoDescription({ item }: { item: ScenicItem }) {
  if (item.geoRef.kind === "route-interval") {
    return (
      <p className="mt-2 text-sm leading-6 text-foreground/80">
        {item.geoRef.fromLabel} → {item.geoRef.toLabel}
      </p>
    );
  }
  if (item.geoRef.kind === "exact") {
    return (
      <p className="mt-2 text-sm leading-6 text-foreground/80">
        地图位置：{item.geoRef.mapQuery}
      </p>
    );
  }
  return (
    <p className="mt-2 text-sm leading-6 text-foreground/80">
      {item.geoRef.reason}
    </p>
  );
}

export function ScenicDetailPanel({
  item,
  selectedDayId,
}: {
  item?: ScenicItem;
  selectedDayId: string;
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
  const parkingAction = getParkingAction(item);

  return (
    <section className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-background p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {corridor ? "车览走廊" : scenicKindLabels[item.kind]}
        </Badge>
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
        {item.dayId !== selectedDayId ? (
          <Badge variant="secondary">源自 {item.dayId} 返程补拍</Badge>
        ) : null}
      </div>

      <h2 className="mt-4 pr-8 text-xl font-semibold leading-7" aria-live="polite">
        {item.title}
      </h2>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-y py-4 text-sm">
        <div>
          <dt className="flex items-center gap-2 text-xs text-muted-foreground">
            <CompassIcon className="size-3.5" aria-hidden="true" />
            行驶方向
          </dt>
          <dd className="mt-1 font-medium">
            {scenicDirectionLabels[item.direction]}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3Icon className="size-3.5" aria-hidden="true" />
            预计停留
          </dt>
          <dd className="mt-1 font-medium tabular-nums">
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

      <div className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheckIcon
            className="size-4 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          停车
        </h3>
        <p className="mt-2 text-sm font-medium">
          {scenicParkingLabels[item.parking.level]} ·{" "}
          {scenicVerificationLabels[item.parking.verificationStatus]}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {item.parking.note}
        </p>
        {parkingAction ? (
          <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
            {parkingAction}
          </p>
        ) : null}
        {item.parking.entryDirectionNote ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            进出方向：{item.parking.entryDirectionNote}
          </p>
        ) : null}
        {item.parking.capacityNote ? (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            现场提示：{item.parking.capacityNote}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold">拍摄对象</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {scenicSubjectLabels[subject]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {navigationTarget ? (
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
        ) : null}
        <CopyAction
          text={buildScenicItemCopyText(item)}
          label={corridor ? "复制走廊" : "复制观景信息"}
          className={navigationTarget ? undefined : "sm:col-span-2"}
        />
      </div>
    </section>
  );
}
