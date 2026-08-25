"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  CloudOffIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  LuggageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ChecklistDefinition } from "@/data/trips/2026-chuanxi/checklists";
import type { Trip } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import {
  buildChecklistInstances,
  createChecklistItemKey,
  createChecklistStorageKey,
  getChecklistItemKeys,
  getChecklistProgress,
  getInstancesByScope,
  mergeChecklistState,
  parsePersistedChecklistState,
  resetChecklistItems,
  setChecklistItemChecked,
  type ChecklistInstance,
  type PersistedChecklistState,
} from "./checklist-model";

type WorkspaceView = "pretrip" | "daily";
type StorageStatus = "loading" | "ready" | "unavailable";
type ResetScope = "today" | "all" | null;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "Asia/Shanghai",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T12:00:00+08:00`));
}

function ProgressBar({ checked, total }: { checked: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`已完成 ${checked} 项，共 ${total} 项`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={checked}
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-200 dark:bg-emerald-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {checked}/{total}
      </span>
    </div>
  );
}

function ChecklistBlock({
  tripId,
  instance,
  checkedKeys,
  onCheckedChange,
}: {
  tripId: string;
  instance: ChecklistInstance;
  checkedKeys: Set<string>;
  onCheckedChange: (key: string, checked: boolean) => void;
}) {
  const itemKeys = instance.items.map((item) =>
    createChecklistItemKey(tripId, instance.instanceId, item.id),
  );
  const progress = getChecklistProgress(checkedKeys, itemKeys);

  return (
    <section
      aria-labelledby={`${instance.instanceId}-title`}
      className="border-t pt-6 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id={`${instance.instanceId}-title`}
              className="text-lg font-semibold"
            >
              {instance.title}
            </h2>
            {progress.checked === progress.total ? (
              <CheckCircle2Icon
                className="size-4 text-emerald-600 dark:text-emerald-400"
                aria-label="本组已完成"
              />
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {instance.description}
          </p>
        </div>
        <ProgressBar checked={progress.checked} total={progress.total} />
      </div>

      <ul className="mt-4 divide-y border-y">
        {instance.items.map((item) => {
          const itemKey = createChecklistItemKey(
            tripId,
            instance.instanceId,
            item.id,
          );
          const checked = checkedKeys.has(itemKey);
          return (
            <li key={item.id}>
              <label
                className={cn(
                  "grid min-h-14 cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] gap-3 px-1 py-3 transition-colors hover:bg-muted/40 sm:px-3",
                  item.critical && "border-l-2 border-l-amber-500 pl-3",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) =>
                    onCheckedChange(itemKey, event.currentTarget.checked)
                  }
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-emerald-700"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm font-medium leading-6",
                      checked && "text-muted-foreground line-through",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.note ? (
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {item.note}
                    </span>
                  ) : null}
                  {item.critical ? (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <AlertTriangleIcon
                        className="size-3"
                        aria-hidden="true"
                      />
                      安全关键项
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ChecklistWorkspace({
  trip,
  definitions,
  contentVersion,
}: {
  trip: Trip;
  definitions: ChecklistDefinition[];
  contentVersion: string;
}) {
  const dayIds = useMemo(() => trip.days.map((day) => day.id), [trip.days]);
  const instances = useMemo(
    () => buildChecklistInstances(definitions, dayIds),
    [dayIds, definitions],
  );
  const allItemKeys = useMemo(
    () => getChecklistItemKeys(trip.id, instances),
    [instances, trip.id],
  );
  const [view, setView] = useState<WorkspaceView>("pretrip");
  const [selectedDayId, setSelectedDayId] = useState(trip.days[0]?.id ?? "D0");
  const [storageStatus, setStorageStatus] = useState<StorageStatus>("loading");
  const [resetScope, setResetScope] = useState<ResetScope>(null);
  const [state, setState] = useState<PersistedChecklistState>(() =>
    mergeChecklistState(null, allItemKeys, contentVersion),
  );

  useEffect(() => {
    try {
      const persisted = parsePersistedChecklistState(
        window.localStorage.getItem(createChecklistStorageKey(trip.id)),
      );
      setState(mergeChecklistState(persisted, allItemKeys, contentVersion));
      setStorageStatus("ready");
    } catch {
      setStorageStatus("unavailable");
    }
  }, [allItemKeys, contentVersion, trip.id]);

  const checkedKeys = useMemo(
    () => new Set(state.checkedItemKeys),
    [state.checkedItemKeys],
  );
  const selectedDayIndex = Math.max(
    0,
    trip.days.findIndex((day) => day.id === selectedDayId),
  );
  const selectedDay = trip.days[selectedDayIndex];
  const visibleInstances =
    view === "pretrip"
      ? getInstancesByScope(instances, "pretrip")
      : [
          ...getInstancesByScope(instances, "daily-departure", selectedDayId),
          ...getInstancesByScope(instances, "daily-close", selectedDayId),
        ];
  const visibleItemKeys = getChecklistItemKeys(trip.id, visibleInstances);
  const visibleProgress = getChecklistProgress(checkedKeys, visibleItemKeys);

  function persist(nextState: PersistedChecklistState) {
    setState(nextState);
    try {
      window.localStorage.setItem(
        createChecklistStorageKey(trip.id),
        JSON.stringify(nextState),
      );
      setStorageStatus("ready");
    } catch {
      setStorageStatus("unavailable");
    }
  }

  function setChecked(itemKey: string, checked: boolean) {
    persist(setChecklistItemChecked(state, itemKey, checked));
  }

  function confirmReset() {
    const keysToReset = resetScope === "today" ? visibleItemKeys : allItemKeys;
    persist(resetChecklistItems(state, keysToReset));
    setResetScope(null);
  }

  function moveDay(offset: number) {
    const nextIndex = Math.min(
      trip.days.length - 1,
      Math.max(0, selectedDayIndex + offset),
    );
    setSelectedDayId(trip.days[nextIndex].id);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="grid gap-5 border-b pb-7 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ClipboardCheckIcon className="size-4" aria-hidden="true" />
            本机勾选 · 内容版本 {contentVersion}
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            准备与每日清单
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            勾选只保存在当前浏览器，不上传成员信息。安全关键项必须由对应负责人实际确认。
          </p>
        </div>
        <div className="border-l-2 border-emerald-600 pl-4">
          <p className="text-xs text-muted-foreground">当前视图</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {visibleProgress.percent}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {visibleProgress.checked} / {visibleProgress.total} 项完成
          </p>
        </div>
      </header>

      {storageStatus === "unavailable" ? (
        <div
          className="mt-5 flex items-start gap-3 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
          role="status"
        >
          <CloudOffIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-6">
            浏览器无法保存清单；本页仍可继续阅读和勾选，但刷新后状态可能丢失。
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex rounded-md bg-muted p-1"
          aria-label="清单视图"
        >
          <button
            type="button"
            onClick={() => setView("pretrip")}
            aria-pressed={view === "pretrip"}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm font-medium",
              view === "pretrip"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LuggageIcon className="size-4" aria-hidden="true" />
            行前准备
          </button>
          <button
            type="button"
            onClick={() => setView("daily")}
            aria-pressed={view === "daily"}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm font-medium",
              view === "daily"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShieldCheckIcon className="size-4" aria-hidden="true" />
            每日执行
          </button>
        </div>

        <div className="flex items-center gap-2">
          {view === "daily" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetScope("today")}
            >
              <RotateCcwIcon aria-hidden="true" />
              仅重置今天
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetScope("all")}
          >
            <RotateCcwIcon aria-hidden="true" />
            全部重置
          </Button>
        </div>
      </div>

      {view === "daily" && selectedDay ? (
        <div className="mt-6 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center border-y py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveDay(-1)}
            disabled={selectedDayIndex === 0}
            aria-label="前一天"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>
          <label className="min-w-0 text-center">
            <span className="sr-only">选择行程日期</span>
            <select
              value={selectedDayId}
              onChange={(event) => setSelectedDayId(event.currentTarget.value)}
              className="max-w-full cursor-pointer appearance-none bg-transparent text-center text-sm font-semibold outline-none"
            >
              {trip.days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.id} · {formatDate(day.date)} · {day.title}
                </option>
              ))}
            </select>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              住宿：{selectedDay.overnight.place}
            </span>
          </label>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveDay(1)}
            disabled={selectedDayIndex === trip.days.length - 1}
            aria-label="后一天"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      <div className="mt-7 grid gap-8">
        {visibleInstances.map((instance) => (
          <ChecklistBlock
            key={instance.instanceId}
            tripId={trip.id}
            instance={instance}
            checkedKeys={checkedKeys}
            onCheckedChange={setChecked}
          />
        ))}
      </div>

      <Dialog
        open={resetScope !== null}
        onOpenChange={(open) => !open && setResetScope(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resetScope === "today" ? "重置当天清单？" : "重置全部清单？"}
            </DialogTitle>
            <DialogDescription className="leading-6">
              {resetScope === "today"
                ? `将取消 ${selectedDayId} 出发前与收车清单的全部勾选，行前准备和其他日期不受影响。`
                : "将取消行前准备和 D0-D9 每日清单的全部勾选。此操作无法撤销。"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetScope(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              确认重置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
