"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export type SegmentedControlItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  fullWidth = false,
  "aria-label": ariaLabel,
}: {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
  "aria-label"?: string;
}) {
  const id = React.useId();
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const selected = value ?? internal;
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("relative inline-flex rounded-full bg-muted/70 p-1", fullWidth && "w-full", className)}
    >
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={item.disabled}
            className={cn("relative z-10 min-h-8 min-w-20 flex-1 rounded-full px-3 text-sm font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground")}
            onClick={() => {
              if (item.disabled) return;
              setInternal(item.value);
              onValueChange?.(item.value);
            }}
          >
            {active ? <motion.span layoutId={`${id}-indicator`} className="absolute inset-0 -z-10 rounded-full border bg-background shadow-sm" transition={{ type: "spring", duration: 0.32, bounce: 0.12 }} /> : null}
            <span className="relative flex items-center justify-center gap-1.5">{item.icon}{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
