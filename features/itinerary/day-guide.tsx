import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, BedDoubleIcon, CarFrontIcon, CheckCircle2Icon, Clock3Icon, MapPinIcon, RouteIcon, ShieldAlertIcon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipPathTabs } from "@/components/qiuye-ui/clip-path-tabs";
import { TabsContent } from "@/components/ui/tabs";
import { CopyAction } from "@/features/navigation/copy-action";
import { buildRouteLegCopyText, createAmapSearchUrl } from "@/lib/navigation/map-links";
import type { TripDay } from "@/lib/trip/types";

import { formatDriveTime, formatNumberRange, formatTripDate, intensityLabels } from "./formatters";
import type { DayItinerary } from "./itinerary-model";
import { ScenicRouteList } from "./scenic-route-list";

function DayNavigation({ itinerary }: { itinerary: DayItinerary }) {
  return <nav aria-label="前后日切换" className="flex flex-wrap items-center justify-between gap-2">
    {itinerary.previousDay ? <DayLink day={itinerary.previousDay} direction="previous" /> : <span />}
    {itinerary.nextDay ? <DayLink day={itinerary.nextDay} direction="next" /> : null}
  </nav>;
}

function DayLink({ day, direction }: { day: TripDay; direction: "previous" | "next" }) {
  const previous = direction === "previous";
  return <Link href={`/days/${day.id}`} className="group inline-flex max-w-[48%] items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:bg-accent sm:max-w-none"><span className="text-muted-foreground">{previous ? <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> : null}</span><span className="min-w-0"><span className="block text-[0.6875rem] text-muted-foreground">{previous ? "上一日" : "下一日"} · {day.id}</span><span className="block max-w-40 truncate text-sm font-medium sm:max-w-56">{day.title}</span></span>{!previous ? <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /> : null}</Link>;
}

function RoutePanel({ itinerary }: { itinerary: DayItinerary }) {
  const { day } = itinerary;
  if (!day.legs.length) return <div className="rounded-xl border bg-muted/35 p-5"><p className="flex items-center gap-2 font-medium"><MapPinIcon className="size-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />{day.id === "D0" ? "成都集结日" : "景区交通日"}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{day.id === "D0" ? "完成人员集合、车辆装载和补给，不生成公路导航。" : "社会车辆不进入核心游览线路，按当天开放站点和景交规则执行。"}</p></div>;
  return <div className="space-y-3">{day.legs.map((leg) => <article key={leg.id} className="rounded-xl border p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{leg.id}</p><h3 className="mt-1 text-base font-semibold">{leg.from} → {leg.to}</h3><p className="mt-2 text-sm text-muted-foreground">{leg.via.join(" · ") || "直达"}</p></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><a href={createAmapSearchUrl(leg.navigationQuery)} target="_blank" rel="noopener noreferrer">高德导航 <ArrowUpRightIcon aria-hidden="true" /></a></Button><CopyAction text={buildRouteLegCopyText(leg)} label="复制路线" /></div></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm sm:grid-cols-3"><div><dt className="text-xs text-muted-foreground">规划距离</dt><dd className="mt-1 font-medium tabular-nums">{formatNumberRange(leg.distanceKmEstimate, "km")}</dd></div><div><dt className="text-xs text-muted-foreground">纯驾驶</dt><dd className="mt-1 font-medium tabular-nums">{formatDriveTime(leg.driveMinutesEstimate)}</dd></div><div><dt className="text-xs text-muted-foreground">最晚到达</dt><dd className="mt-1 font-medium">{leg.latestArrival ?? "按当天车机"}</dd></div></dl></article>)}</div>;
}

function NoteList({ title, items, icon: Icon, tone = "default" }: { title: string; items: string[]; icon: typeof CheckCircle2Icon; tone?: "default" | "warning" }) {
  if (!items.length) return <p className="rounded-xl border p-4 text-sm text-muted-foreground">暂无特别说明。</p>;
  return <section className={tone === "warning" ? "rounded-xl border border-amber-300 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/20" : "rounded-xl border p-4"}><h3 className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />{title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export function DayGuide({ itinerary }: { itinerary: DayItinerary }) {
  const { day } = itinerary;
  const tabItems = [{ value: "route", label: "路线", icon: <RouteIcon /> }, { value: "scenic", label: "观景", icon: <SparklesIcon /> }, { value: "notes", label: "注意", icon: <ShieldAlertIcon /> }];
  return <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
    <nav aria-label="面包屑" className="text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground">总览</Link><span className="px-2" aria-hidden="true">/</span><Link href="/itinerary" className="hover:text-foreground">行程</Link><span className="px-2" aria-hidden="true">/</span><span className="text-foreground">{day.id}</span></nav>
    <header className="mt-6"><div className="flex flex-wrap items-center gap-2"><Badge className="bg-emerald-700 text-white hover:bg-emerald-700">{day.id}</Badge><Badge variant="outline">{formatTripDate(day.date)}</Badge><Badge variant="outline">{intensityLabels[day.intensity]}</Badge></div><h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{day.title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{day.primaryGoal}</p></header>
    <div className="mt-6"><DayNavigation itinerary={itinerary} /></div>
    <section className="mt-6 rounded-2xl bg-[#17231d] px-5 py-5 text-white shadow-sm dark:bg-[#111a16] sm:px-7"><p className="text-xs font-medium text-emerald-200">今天只记住这一件事</p><p className="mt-2 text-xl font-semibold leading-8 sm:text-2xl">{day.primaryGoal}</p>{itinerary.timePriority ? <p className="mt-3 flex items-start gap-2 border-t border-white/15 pt-3 text-sm leading-6 text-white/70"><Clock3Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />{itinerary.timePriority.condition}：{itinerary.timePriority.action}</p> : null}</section>
    <div className="mt-7"><ClipPathTabs items={tabItems} defaultValue="route">
      <TabsContent value="route" className="mt-0"><RoutePanel itinerary={itinerary} /></TabsContent>
      <TabsContent value="scenic" className="mt-0"><section><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">沿行驶方向排列</p><h2 className="mt-1 text-xl font-semibold">核心停靠与车览</h2></div><Button asChild variant="outline" size="sm"><Link href={`/scenic?day=${day.id}`}>打开观景页 <ArrowRightIcon aria-hidden="true" /></Link></Button></div><div className="mt-4"><ScenicRouteList items={itinerary.scenicSummary} compact /></div></section></TabsContent>
      <TabsContent value="notes" className="mt-0"><div className="grid gap-4 sm:grid-cols-2"><NoteList title="必须完成" items={day.mustDo} icon={CheckCircle2Icon} /><NoteList title="条件允许再做" items={day.optional} icon={SparklesIcon} /><NoteList title="当日降级触发" items={day.fallbackTriggers.map((trigger) => `${trigger.condition}：${trigger.action}`)} icon={ShieldAlertIcon} tone="warning" /><section className="rounded-xl border p-4"><h3 className="flex items-center gap-2 text-sm font-semibold"><BedDoubleIcon className="size-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />今晚落脚</h3><dl className="mt-3 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-muted-foreground">地点</dt><dd className="mt-1 font-medium">{day.overnight.place}</dd></div><div><dt className="text-xs text-muted-foreground">海拔估算</dt><dd className="mt-1 font-medium tabular-nums">{day.overnight.altitudeMEstimate ? `${day.overnight.altitudeMEstimate[0]}–${day.overnight.altitudeMEstimate[1]} m` : "按现场"}</dd></div></dl></section></div></TabsContent>
    </ClipPathTabs></div>
    <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground"><CarFrontIcon className="size-4" aria-hidden="true" />实际道路、天气和停车以当天车机与现场为准。</div>
  </div>;
}
