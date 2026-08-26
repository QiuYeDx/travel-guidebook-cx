import Link from "next/link";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BookOpenTextIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  CloudSnowIcon,
  FlagIcon,
  HeartPulseIcon,
  MapPinnedIcon,
  MountainSnowIcon,
  RouteIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  FallbackTrigger,
  PlanningItemStatus,
  PlanningSnapshot,
  Trip,
} from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import type { TripOverview } from "./overview-model";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  timeZone: "Asia/Shanghai",
});

const fullDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Shanghai",
});

const riskIcons = {
  health: HeartPulseIcon,
  weather: CloudSnowIcon,
  road: RouteIcon,
  booking: CalendarCheckIcon,
  vehicle: CarFrontIcon,
  time: Clock3Icon,
} satisfies Record<FallbackTrigger["category"], typeof RouteIcon>;

const statusMeta = {
  open: { label: "待确认", icon: CircleDashedIcon },
  "in-progress": { label: "进行中", icon: Clock3Icon },
  confirmed: { label: "已确认", icon: CheckCircle2Icon },
} satisfies Record<
  PlanningItemStatus,
  { label: string; icon: typeof CircleDashedIcon }
>;

function toDate(value: string): Date {
  return new Date(`${value}T12:00:00+08:00`);
}

function formatDate(value: string): string {
  return dateFormatter.format(toDate(value));
}

function formatFullDate(value?: string): string {
  return value ? fullDateFormatter.format(toDate(value)) : "待建立";
}

function PlanningStatus({ status }: { status: PlanningItemStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium",
        status === "confirmed"
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-amber-700 dark:text-amber-400",
      )}
    >
      <meta.icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function OverviewMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="min-w-0 border-l border-white/15 pl-4 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-4">
      <dt className="text-xs text-white/60">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums text-white">
        {value}
      </dd>
      <p className="mt-1 text-xs leading-5 text-white/55">{note}</p>
    </div>
  );
}

function RouteOverview({ overview }: { overview: TripOverview }) {
  return (
    <section
      aria-labelledby="route-overview-title"
      className="overflow-hidden rounded-2xl bg-[#17231d] text-white shadow-sm dark:bg-[#111a16]"
    >
      <div className="grid gap-7 px-5 py-6 sm:px-7 sm:py-7">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <RouteIcon className="size-4" aria-hidden="true" />
                推荐主线 A
              </p>
              <h2
                id="route-overview-title"
                className="mt-2 text-xl font-semibold leading-7 sm:text-2xl"
              >
                成都出发，亚丁折返，经丹巴与四姑娘山回蓉
              </h2>
            </div>
            <MountainSnowIcon
              className="hidden size-10 shrink-0 text-emerald-300/70 lg:block"
              aria-hidden="true"
            />
            <ArrowRightIcon
              className="size-5 shrink-0 text-emerald-200 lg:hidden"
              aria-label="向右查看后续日程"
            />
          </div>

          <div className="mt-6 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
            <ol
              aria-label="D0 至 D9 主线路线"
              className="flex min-w-[60rem] items-start"
            >
              {overview.routeNodes.map((node, index) => (
                <li className="relative w-24 shrink-0 pr-3" key={node.id}>
                  <Link
                    href={`/days/${node.id}`}
                    className="group block min-h-20 focus-visible:outline-none"
                  >
                    <div className="flex items-center" aria-hidden="true">
                      <span
                        className={cn(
                          "relative z-10 size-3 rounded-full border-2 transition-colors group-hover:bg-emerald-200 group-focus-visible:bg-emerald-200",
                          index === 0 ||
                            index === overview.routeNodes.length - 1
                            ? "border-emerald-200 bg-emerald-400"
                            : "border-emerald-200/80 bg-[#17231d]",
                        )}
                      />
                      {index < overview.routeNodes.length - 1 ? (
                        <span className="h-px flex-1 bg-emerald-200/35" />
                      ) : null}
                    </div>
                    <p className="mt-3 text-xs font-semibold text-emerald-100 group-hover:underline group-focus-visible:underline">
                      {node.id} · {formatDate(node.date)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/65">
                      {node.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/15 pt-6 sm:grid-cols-4">
          <OverviewMetric
            label="行程"
            value={`${overview.durationDays} 天`}
            note={`${overview.drivingDays} 个公路移动日`}
          />
          <OverviewMetric
            label="主干路段"
            value={`${overview.distanceKmEstimate[0]}-${overview.distanceKmEstimate[1]}`}
            note="公里规划估算，不含临时支线"
          />
          <OverviewMetric
            label="观景目录"
            value={`${overview.scenicItemCount} 处`}
            note="停靠点与连续车览走廊"
          />
          <OverviewMetric
            label="降级方案"
            value="B / C"
            note="取消亚丁或提前回撤"
          />
        </dl>
      </div>
    </section>
  );
}

function Decisions({ planning }: { planning: PlanningSnapshot }) {
  return (
    <section aria-labelledby="decisions-title">
      <div className="flex items-end justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            先关闭再订房
          </p>
          <h2
            id="decisions-title"
            className="mt-1 scroll-mt-20 text-xl font-semibold"
          >
            六项待确认决策
          </h2>
        </div>
        <Badge
          variant="outline"
          className="border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-300"
        >
          {
            planning.decisions.filter((item) => item.status !== "confirmed")
              .length
          }
          项未关闭
        </Badge>
      </div>

      <ol className="divide-y">
        {planning.decisions.map((decision, index) => (
          <li
            className="grid gap-3 py-5 sm:grid-cols-[2rem_minmax(0,1fr)_7rem] sm:items-start"
            key={decision.id}
          >
            <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-sm font-semibold sm:text-base">
                  {decision.title}
                </h3>
                <PlanningStatus status={decision.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                {decision.recommendation}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                影响：{decision.impact}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:justify-end">
              <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
              <time dateTime={decision.deadline.date}>
                {decision.deadline.label}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PreparationProgress({
  planning,
  overview,
}: {
  planning: PlanningSnapshot;
  overview: TripOverview;
}) {
  const progress =
    overview.taskCount === 0
      ? 0
      : Math.round((overview.confirmedTaskCount / overview.taskCount) * 100);

  return (
    <section
      aria-labelledby="progress-title"
      className="border-t pt-6 lg:border-t-0 lg:pt-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            以仓库记录为准
          </p>
          <h2 id="progress-title" className="mt-1 text-lg font-semibold">
            预订与复核进度
          </h2>
        </div>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {overview.confirmedTaskCount}/{overview.taskCount}
        </span>
      </div>

      <div
        aria-label={`已确认 ${progress}%`}
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-emerald-600 transition-[width] motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-5 divide-y border-y">
        {planning.tasks.map((task) => (
          <li className="py-4" key={task.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{task.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {task.note}
                </p>
              </div>
              <PlanningStatus status={task.status} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3Icon className="size-3.5" aria-hidden="true" />
              <time dateTime={task.deadline.date}>{task.deadline.label}</time>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RiskSummary({ risks }: { risks: FallbackTrigger[] }) {
  return (
    <section aria-labelledby="risk-title">
      <div className="flex items-center gap-3">
        <ShieldAlertIcon
          className="size-5 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
        <div>
          <p className="text-xs font-medium text-red-700 dark:text-red-400">
            触发即降级
          </p>
          <h2
            id="risk-title"
            className="mt-1 scroll-mt-20 text-xl font-semibold"
          >
            关键风险不是可选提醒
          </h2>
        </div>
      </div>

      <div className="mt-5 grid border-y md:grid-cols-3 md:divide-x">
        {risks.slice(0, 3).map((risk) => {
          const Icon = riskIcons[risk.category];
          return (
            <article
              className="border-b py-5 last:border-b-0 md:border-b-0 md:px-5 md:first:pl-0 md:last:pr-0"
              key={risk.id}
            >
              <Icon
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="mt-3 text-sm font-semibold leading-6">
                {risk.condition}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {risk.action}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PlanningDashboard({
  trip,
  planning,
  overview,
}: {
  trip: Trip;
  planning: PlanningSnapshot;
  overview: TripOverview;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <section aria-labelledby="page-title" className="pb-8 sm:pb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <MapPinnedIcon className="size-4" aria-hidden="true" />
              {formatDate(trip.startDate)} 成都集结 · {formatDate(trip.endDate)}{" "}
              返回成都
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <h1
                id="page-title"
                className="text-3xl font-semibold leading-tight sm:text-4xl"
              >
                {trip.name}
              </h1>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
                  <FlagIcon aria-hidden="true" />
                  行前模式
                </Badge>
                <Badge variant="outline">正式路书 v{trip.contentVersion}</Badge>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              计划快照 {formatFullDate(planning.updatedAt)}
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              第一次川西、低体力消耗版大环线。当前优先关闭人数、车辆、驾驶员、亚丁原则与住宿，
              已确认信息再进入每日执行页。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/guidebook">
                <BookOpenTextIcon aria-hidden="true" />
                阅读完整攻略
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/guidebook#b-方案取消亚丁的舒适北环线">
                <AlertTriangleIcon aria-hidden="true" />
                查看降级方案
              </Link>
            </Button>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
          <div className="bg-background px-4 py-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <UsersIcon className="size-4" aria-hidden="true" />
              团队规模
            </dt>
            <dd className="mt-2 text-sm font-semibold">6 人优先 · 7 人待定</dd>
          </div>
          <div className="bg-background px-4 py-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <CarFrontIcon className="size-4" aria-hidden="true" />
              计划车辆
            </dt>
            <dd className="mt-2 text-sm font-semibold">蔚来 ES8 · 参数待定</dd>
          </div>
          <div className="bg-background px-4 py-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              行程窗口
            </dt>
            <dd className="mt-2 text-sm font-semibold">9/27-10/6 · 10 天</dd>
          </div>
          <div className="bg-background px-4 py-4">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <MountainSnowIcon className="size-4" aria-hidden="true" />
              体力策略
            </dt>
            <dd className="mt-2 text-sm font-semibold">轻量观景 · 不夜驾</dd>
          </div>
        </dl>
      </section>

      <RouteOverview overview={overview} />

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-14 lg:py-14">
        <Decisions planning={planning} />
        <PreparationProgress planning={planning} overview={overview} />
      </div>

      <RiskSummary risks={overview.criticalRisks} />
    </div>
  );
}
