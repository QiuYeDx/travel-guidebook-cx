"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ListIcon, MapPinnedIcon, WifiOffIcon } from "lucide-react";

import { ResponsiveTabs, TabsContent } from "@/components/qiuye-ui/responsive-tabs";
import type { ScenicItem, SourceRef } from "@/lib/trip/types";

import { ScenicDetailPanel } from "./scenic-detail-panel";
import { ScenicItemList } from "./scenic-item-list";
import { resolveSelectedScenicItem } from "./scenic-model";

function subscribe(callback: () => void) { window.addEventListener("online", callback); window.addEventListener("offline", callback); return () => { window.removeEventListener("online", callback); window.removeEventListener("offline", callback); }; }
function getSnapshot() { return navigator.onLine; }
function getServerSnapshot() { return true; }

export function ScenicWorkspace({ dayId, items, sources, initialSelectedItemId }: { dayId: string; items: ScenicItem[]; sources: SourceRef[]; initialSelectedItemId?: string }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(() => resolveSelectedScenicItem(items, initialSelectedItemId)?.id);
  const [view, setView] = useState("list");
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const selectedItem = resolveSelectedScenicItem(items, selectedId);

  const syncUrl = useCallback((itemId?: string) => {
    const params = new URLSearchParams(window.location.search); params.set("day", dayId); if (itemId) params.set("item", itemId); else params.delete("item"); window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
  }, [dayId]);
  useEffect(() => { if (selectedItem?.id !== selectedId) { setSelectedId(selectedItem?.id); syncUrl(selectedItem?.id); } }, [selectedId, selectedItem?.id, syncUrl]);

  function selectItem(itemId: string) { setSelectedId(itemId); setView("detail"); syncUrl(itemId); }

  return <section className="py-7" aria-labelledby="scenic-workspace-title">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{dayId} · 按行驶顺序</p><h2 id="scenic-workspace-title" className="mt-1 text-2xl font-semibold">沿途观景</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">优先看能安全停车的点；连续车览走廊只在乘客侧记录，驾驶员不为拍照临停。</p></div><span className="shrink-0 text-sm tabular-nums text-muted-foreground">{items.length} 处</span></div>
    {!isOnline ? <p className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-100"><WifiOffIcon className="mt-1 size-4 shrink-0" aria-hidden="true" />当前离线。路线顺序与已缓存的观景说明仍可查看，外部地图请联网后使用。</p> : null}
    <div className="mt-6"><ResponsiveTabs value={view} onValueChange={setView} items={[{ value: "list", label: "按顺序浏览", icon: <ListIcon /> }, { value: "detail", label: "查看详情", icon: <MapPinnedIcon /> }]}>
      <TabsContent value="list" className="mt-0"><div className="grid gap-3 lg:grid-cols-2"><ScenicItemList items={items} selectedId={selectedItem?.id} onSelect={selectItem} /></div></TabsContent>
      <TabsContent value="detail" className="mt-0"><div className="mx-auto max-w-2xl"><ScenicDetailPanel item={selectedItem} selectedDayId={dayId} sources={sources} isOnline={isOnline} /></div></TabsContent>
    </ResponsiveTabs></div>
  </section>;
}
