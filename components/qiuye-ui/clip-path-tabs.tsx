"use client";

import * as React from "react";
import { motion } from "motion/react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ClipPathTabsItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function ClipPathTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  listClassName,
}: {
  items: ClipPathTabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  listClassName?: string;
}) {
  const id = React.useId();
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.value);
  const resolvedValue = value ?? internalValue;
  return (
    <Tabs
      className={cn("w-full", className)}
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(next) => { setInternalValue(next); onValueChange?.(next); }}
    >
      <TabsList
        aria-label="内容视图"
        className={cn(
          "h-11 w-full justify-start gap-1 rounded-xl bg-muted/70 p-1",
          listClassName,
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="relative h-9 flex-1 rounded-lg px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {item.value === resolvedValue ? (
              <motion.span
                layoutId={`${id}-active`}
                className="absolute inset-0 rounded-lg bg-background shadow-sm"
                transition={{ type: "spring", duration: 0.32, bounce: 0.12 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-5">{children}</div>
    </Tabs>
  );
}
