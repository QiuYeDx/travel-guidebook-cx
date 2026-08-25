"use client";

import { ClipboardListIcon, NavigationIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { useTripMode } from "./trip-mode-provider";

export function TripModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, hydrated } = useTripMode();

  return (
    <div
      className="inline-flex shrink-0 rounded-md bg-muted p-1"
      aria-label="路书使用模式"
    >
      <button
        type="button"
        aria-pressed={mode === "planning"}
        disabled={!hydrated}
        onClick={() => setMode("planning")}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-2 text-xs font-medium transition-colors disabled:cursor-wait",
          mode === "planning"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ClipboardListIcon className="size-3.5" aria-hidden="true" />
        {compact ? "行前" : "行前讨论"}
      </button>
      <button
        type="button"
        aria-pressed={mode === "onTrip"}
        disabled={!hydrated}
        onClick={() => setMode("onTrip")}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-2 text-xs font-medium transition-colors disabled:cursor-wait",
          mode === "onTrip"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <NavigationIcon className="size-3.5" aria-hidden="true" />
        {compact ? "行中" : "行中执行"}
      </button>
    </div>
  );
}
