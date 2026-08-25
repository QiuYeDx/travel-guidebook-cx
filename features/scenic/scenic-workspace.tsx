"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { ListFilterIcon, RouteIcon, WifiOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ScenicItem, SourceRef } from "@/lib/trip/types";

import { ScenicDetailPanel } from "./scenic-detail-panel";
import { ScenicFilterBar } from "./scenic-filter-bar";
import { ScenicItemList } from "./scenic-item-list";
import {
  countActiveScenicFilters,
  defaultScenicFilters,
  filterScenicItems,
  getAvailableSubjects,
  resolveSelectedScenicItem,
} from "./scenic-model";
import { ScenicRouteBand } from "./scenic-route-band";

function subscribeToNetworkStatus(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

export function ScenicWorkspace({
  dayId,
  items,
  sources,
  initialSelectedItemId,
}: {
  dayId: string;
  items: ScenicItem[];
  sources: SourceRef[];
  initialSelectedItemId?: string;
}) {
  const [filters, setFilters] = useState(defaultScenicFilters);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => resolveSelectedScenicItem(items, initialSelectedItemId)?.id,
  );
  const isOnline = useSyncExternalStore(
    subscribeToNetworkStatus,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );
  const subjects = useMemo(() => getAvailableSubjects(items), [items]);
  const filteredItems = useMemo(
    () => filterScenicItems(items, filters),
    [filters, items],
  );
  const selectedItem = resolveSelectedScenicItem(filteredItems, selectedId);
  const activeFilterCount = countActiveScenicFilters(filters);

  const syncSelectedItemUrl = useCallback(
    (itemId?: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set("day", dayId);
      if (itemId) params.set("item", itemId);
      else params.delete("item");
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    },
    [dayId],
  );

  useEffect(() => {
    if (selectedItem?.id !== selectedId) {
      setSelectedId(selectedItem?.id);
      syncSelectedItemUrl(selectedItem?.id);
    }
  }, [selectedId, selectedItem?.id, syncSelectedItemUrl]);

  function selectItem(itemId: string) {
    setSelectedId(itemId);
    syncSelectedItemUrl(itemId);
  }

  function resetFilters() {
    setFilters(defaultScenicFilters);
  }

  return (
    <section className="py-7" aria-labelledby="scenic-workspace-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            路线带、列表与详情共享同一选择
          </p>
          <h2
            id="scenic-workspace-title"
            className="mt-1 text-xl font-semibold"
          >
            当日观景工作区
          </h2>
        </div>
        <p
          className="text-sm text-muted-foreground tabular-nums"
          aria-live="polite"
        >
          显示 {filteredItems.length} / {items.length} 个条目
        </p>
      </div>

      <div className="mt-5">
        <ScenicFilterBar
          filters={filters}
          subjects={subjects}
          activeFilterCount={activeFilterCount}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </div>

      {!isOnline ? (
        <p className="mt-5 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-100">
          <WifiOffIcon className="mt-1 size-4 shrink-0" aria-hidden="true" />
          当前离线。路线带、顺序和安全结论仍可读取；来源与外部地图操作已停用。
        </p>
      ) : null}

      <div className="mt-7 grid gap-7 lg:grid-cols-[15rem_minmax(0,1fr)_20rem]">
        <section
          aria-labelledby="scenic-route-band-title"
          className="min-w-0 lg:sticky lg:top-20 lg:self-start"
        >
          <h3
            id="scenic-route-band-title"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <RouteIcon
              className="size-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            路线带
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            圆形为停靠点，方形虚线为连续车览走廊。
          </p>
          <div className="mt-4">
            <ScenicRouteBand
              items={filteredItems}
              selectedId={selectedItem?.id}
              onSelect={selectItem}
            />
          </div>
        </section>

        <div className="min-w-0 space-y-7">
          <div className="lg:hidden">
            <ScenicDetailPanel
              item={selectedItem}
              selectedDayId={dayId}
              sources={sources}
              isOnline={isOnline}
            />
          </div>

          <section aria-labelledby="scenic-result-list-title">
            <h3
              id="scenic-result-list-title"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <ListFilterIcon
                className="size-4 text-emerald-700 dark:text-emerald-400"
                aria-hidden="true"
              />
              筛选结果
            </h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              选择任一条目可同步路线带和详情；驾驶中请由乘客操作。
            </p>

            {filteredItems.length > 0 ? (
              <div className="mt-4">
                <ScenicItemList
                  items={filteredItems}
                  selectedId={selectedItem?.id}
                  onSelect={selectItem}
                />
              </div>
            ) : (
              <div className="mt-4 border-y py-10 text-center">
                <h4 className="text-base font-semibold">没有符合条件的点</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  当前组合过窄；清除筛选后会恢复当日完整路线顺序。
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={resetFilters}
                >
                  清除全部筛选
                </Button>
              </div>
            )}
          </section>
        </div>

        <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <ScenicDetailPanel
            item={selectedItem}
            selectedDayId={dayId}
            sources={sources}
            isOnline={isOnline}
          />
        </aside>
      </div>
    </section>
  );
}
