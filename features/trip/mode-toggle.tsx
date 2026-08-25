"use client";

import { ClipboardListIcon, NavigationIcon } from "lucide-react";

import { SegmentedControl } from "@/components/qiuye-ui/segmented-control";

import { useTripMode } from "./trip-mode-provider";

export function TripModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, hydrated } = useTripMode();

  return <SegmentedControl
    aria-label="路书使用模式"
    value={mode}
    onValueChange={(value) => setMode(value as "planning" | "onTrip")}
    items={[
      {
        value: "planning",
        label: compact ? "行前" : "行前讨论",
        icon: <ClipboardListIcon className="size-3.5" aria-hidden="true" />,
        disabled: !hydrated,
      },
      {
        value: "onTrip",
        label: compact ? "行中" : "行中执行",
        icon: <NavigationIcon className="size-3.5" aria-hidden="true" />,
        disabled: !hydrated,
      },
    ]}
  />;
}
