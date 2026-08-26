"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ScenicItem } from "@/lib/trip/types";

import { ScenicDetailPanel } from "./scenic-detail-panel";
import { ScenicItemList } from "./scenic-item-list";

export function ScenicWorkspace({ dayId, items, initialSelectedItemId }: { dayId: string; items: ScenicItem[]; initialSelectedItemId?: string }) {
  const initialItem = items.find((item) => item.id === initialSelectedItemId);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialItem?.id);
  const [detailsOpen, setDetailsOpen] = useState(Boolean(initialItem));
  const selectedItem = items.find((item) => item.id === selectedId);

  const syncUrl = useCallback((itemId?: string) => {
    const params = new URLSearchParams(window.location.search); params.set("day", dayId); if (itemId) params.set("item", itemId); else params.delete("item"); window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
  }, [dayId]);
  useEffect(() => {
    if (initialSelectedItemId && !initialItem) syncUrl();
  }, [initialItem, initialSelectedItemId, syncUrl]);

  function selectItem(itemId: string) {
    setSelectedId(itemId);
    setDetailsOpen(true);
    syncUrl(itemId);
  }

  function handleDetailsOpenChange(open: boolean) {
    setDetailsOpen(open);
    if (!open) syncUrl();
  }

  return <section className="py-7" aria-labelledby="scenic-workspace-title">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{dayId} · 按行驶顺序</p><h2 id="scenic-workspace-title" className="mt-1 text-2xl font-semibold">沿途观景</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">优先看能安全停车的点；连续车览走廊只在乘客侧记录，驾驶员不为拍照临停。</p></div><span className="shrink-0 text-sm tabular-nums text-muted-foreground">{items.length} 处</span></div>
    <div className="mt-6">
      <ScenicItemList items={items} onSelect={selectItem} />
    </div>
    <Dialog open={detailsOpen} onOpenChange={handleDetailsOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-xl p-0 sm:max-w-2xl!">
        <DialogTitle className="sr-only">{selectedItem?.title ?? "观景详情"}</DialogTitle>
        <DialogDescription className="sr-only">
          查看观景位置、停车提示和拍摄对象。
        </DialogDescription>
        <ScenicDetailPanel item={selectedItem} selectedDayId={dayId} />
      </DialogContent>
    </Dialog>
  </section>;
}
