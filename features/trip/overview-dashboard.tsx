import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  MapPinnedIcon,
  MountainSnowIcon,
  RouteIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScenicCatalog, Trip } from "@/lib/trip/types";

import { buildDayItinerary } from "../itinerary/itinerary-model";
import { formatDriveTime, formatTripDate } from "../itinerary/formatters";

export function OverviewDashboard({ trip, scenicCatalog }: { trip: Trip; scenicCatalog: ScenicCatalog }) {
  const drivingDays = trip.days.filter((day) => day.legs.length > 0).length;
  const distance = trip.days.flatMap((day) => day.legs).reduce<[number, number]>((total, leg) => {
    if (!leg.distanceKmEstimate) return total;
    return [total[0] + leg.distanceKmEstimate[0], total[1] + leg.distanceKmEstimate[1]];
  }, [0, 0]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid gap-8 border-b border-border bg-gradient-to-br from-emerald-50 via-background to-background px-5 py-7 text-foreground dark:from-emerald-950/45 dark:via-background dark:to-background sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <Badge variant="secondary">2026 · 9/27 — 10/6</Badge>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">川西大环线</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">成都集结，沿康定、新都桥、理塘、稻城亚丁，经雅江、塔公、丹巴与四姑娘山回到成都。</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link href="/itinerary">查看完整行程 <ArrowRightIcon aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" className="bg-background/70"><Link href="/scenic">浏览沿途观景 <MapPinnedIcon aria-hidden="true" /></Link></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Metric label="行程" value={`${trip.days.length} 天`} />
            <Metric label="公路移动" value={`${drivingDays} 天`} />
            <Metric label="规划里程" value={`${distance[0]}–${distance[1]} km`} />
            <Metric label="观景条目" value={`${scenicCatalog.items.length} 处`} />
          </div>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-8">
          <QuickFact icon={<CarFrontIcon />} label="车辆" value="蔚来 ES8 · 6–7 人" />
          <QuickFact icon={<MountainSnowIcon />} label="节奏" value="轻量观景 · 不夜驾" />
          <QuickFact icon={<SparklesIcon />} label="核心" value="亚丁可取消，优先舒适" />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="route-title">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">唯一正式路线</p><h2 id="route-title" className="mt-1 text-2xl font-semibold">每天走什么</h2></div>
          <Link href="/itinerary" className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex">打开时间线 <ArrowRightIcon className="size-4" aria-hidden="true" /></Link>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trip.days.map((day) => {
            const itinerary = buildDayItinerary(trip, scenicCatalog, day.id);
            return <li key={day.id}><Link href={`/days/${day.id}`} className="group block h-full rounded-xl border bg-card p-4 transition-colors hover:border-emerald-500/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20">
              <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">{day.id}</p><time className="mt-1 block text-xs text-muted-foreground" dateTime={day.date}>{formatTripDate(day.date)}</time></div><ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></div>
              <h3 className="mt-4 text-base font-semibold leading-6">{day.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{day.primaryGoal}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{day.overnight.place}</span>{itinerary?.driveMinutesEstimate ? <span>{formatDriveTime(itinerary.driveMinutesEstimate)}</span> : null}</div>
            </Link></li>;
          })}
        </ol>
      </section>

      <section className="mt-12 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 overflow-hidden rounded-xl border bg-card p-5 sm:p-6"><div className="flex items-center gap-2"><RouteIcon className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" /><h2 className="text-lg font-semibold">路线节奏</h2></div><p className="mt-3 text-sm leading-6 text-muted-foreground">前段逐步升高海拔，中段以亚丁轻量游为核心，后段经塔公、丹巴和四姑娘山回蓉。每天只设一个主目标，沿途观景点按行驶顺序查看。</p><div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2" aria-label="路线顺序"><div className="flex min-w-max items-center gap-2">{trip.days.map((day, index) => <span key={day.id} className="flex items-center gap-2"><Link href={`/days/${day.id}`} className="rounded-full border px-3 py-1.5 text-xs font-medium hover:border-emerald-500 hover:text-emerald-700">{day.id} · {day.overnight.place}</Link>{index < trip.days.length - 1 ? <span className="text-muted-foreground" aria-hidden="true">→</span> : null}</span>)}</div></div></div>
        <div className="rounded-xl border bg-muted/35 p-5 sm:p-6"><div className="flex items-center gap-2"><CalendarDaysIcon className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" /><h2 className="text-lg font-semibold">出发前先看</h2></div><ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><li>每日页：路线、观景、注意事项分开查看。</li><li>观景页：按日期浏览停车与车览策略。</li><li>完整攻略：集中阅读长文和背景说明。</li></ul></div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</dd></div>; }
function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3"><span className="text-emerald-700 dark:text-emerald-400">{icon}</span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div></div>; }
