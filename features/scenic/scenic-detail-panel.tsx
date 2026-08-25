"use client";

import {
  ArrowUpRightIcon,
  Clock3Icon,
  CompassIcon,
  MapPinnedIcon,
  RouteIcon,
  ShieldCheckIcon,
  WifiOffIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAction } from "@/features/navigation/copy-action";
import {
  buildScenicItemCopyText,
  createAmapNavigationUrl,
} from "@/lib/navigation/map-links";
import type { ScenicItem, SourceRef } from "@/lib/trip/types";

import {
  scenicDirectionLabels,
  scenicKindLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
  scenicSubjectLabels,
  scenicVerificationLabels,
} from "./scenic-labels";
import {
  getItemSources,
  getParkingNavigationTarget,
  isScenicCorridor,
} from "./scenic-model";

function getParkingAction(item: ScenicItem): string {
  if (item.parking.level === "prohibited") {
    return "禁止为拍照停车，乘客观察，驾驶员保持行车节奏。";
  }
  if (item.parking.level === "P2") {
    return "默认车览；只有现场明确允许且车辆能完全离开行车道时再判断。";
  }
  if (item.parking.level === "transit-only") {
    return "仅按景区交通体系到达，不生成社会车辆停车操作。";
  }
  if (item.parking.level === "walk-only") {
    return "仅按步道规则到达，不生成社会车辆停车操作。";
  }
  if (item.parking.verificationStatus !== "verified") {
    return "D-7 / D-3 完成坐标、入口和停车状态复核前，不提供停车导航。";
  }
  return "入口已复核；仍以当天交通组织和现场容量为准，满位直接通过。";
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
        已核准公开位置：{item.geoRef.mapQuery}
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
  sources,
  isOnline,
}: {
  item?: ScenicItem;
  selectedDayId: string;
  sources: SourceRef[];
  isOnline: boolean;
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
  const itemSources = getItemSources(item, sources);
  const navigationTarget = getParkingNavigationTarget(item);

  return (
    <section className="h-[34rem] overflow-y-auto rounded-2xl border bg-background p-5 lg:h-auto lg:min-h-[38rem] lg:overflow-visible">
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

      <p className="mt-4 font-mono text-xs text-emerald-700 dark:text-emerald-400">
        {item.id}
      </p>
      <h2 className="mt-1 text-xl font-semibold leading-7" aria-live="polite">
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
          位置表达
        </h3>
        <GeoDescription item={item} />
      </div>

      <div className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheckIcon
            className="size-4 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          停车结论
        </h3>
        <p className="mt-2 text-sm font-medium">
          {scenicParkingLabels[item.parking.level]} ·{" "}
          {scenicVerificationLabels[item.parking.verificationStatus]}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {item.parking.note}
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
          {getParkingAction(item)}
        </p>
        {item.parking.entryDirectionNote ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            入口方向：{item.parking.entryDirectionNote}
          </p>
        ) : null}
        {item.parking.capacityNote ? (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            容量：{item.parking.capacityNote}
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

      <div className="mt-6 border-t pt-5">
        <h3 className="text-sm font-semibold">来源与复核</h3>
        {itemSources.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {itemSources.map((source) => (
              <li key={source.id} className="text-xs leading-5">
                {isOnline ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {source.publisher}
                    <ArrowUpRightIcon
                      className="ml-1 inline size-3"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <span className="font-medium">{source.publisher}</span>
                )}
                <span className="mt-1 block text-muted-foreground">
                  最近核实 {source.verifiedAt}
                  {source.reviewAt ? ` · 下次复核 ${source.reviewAt}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            暂无独立来源引用，按停车说明在 D-7 / D-3 人工复核。
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {navigationTarget && isOnline ? (
          <Button asChild>
            <a
              href={createAmapNavigationUrl(navigationTarget)}
              target="_blank"
              rel="noopener noreferrer"
            >
              导航到核准入口
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </Button>
        ) : null}
        <CopyAction
          text={buildScenicItemCopyText(item)}
          label={corridor ? "复制走廊" : "复制观景信息"}
          className={navigationTarget && isOnline ? undefined : "sm:col-span-2"}
        />
      </div>
      {navigationTarget && !isOnline ? (
        <p className="mt-6 flex items-center gap-2 rounded-xl border p-3 text-xs leading-5 text-muted-foreground">
          <WifiOffIcon className="size-4 shrink-0" aria-hidden="true" />
          当前离线，核准入口导航已停用；可先复制观景信息，恢复网络后再打开外部地图。
        </p>
      ) : null}
    </section>
  );
}
