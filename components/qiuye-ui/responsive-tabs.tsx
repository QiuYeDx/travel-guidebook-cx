"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ResponsiveTabItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
};

export function ResponsiveTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ariaLabel = "内容视图",
}: {
  items: ResponsiveTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Tabs
      className={cn("w-full", className)}
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
    >
      <div className="relative overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList aria-label={ariaLabel} className="inline-flex min-w-full justify-start gap-1 rounded-xl bg-muted/70 p-1 sm:w-full">
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="min-h-9 shrink-0 gap-1.5 rounded-lg px-3 text-sm sm:flex-1"
            >
              {item.icon}
              {item.label}
              {item.badge}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" aria-hidden="true" />
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </Tabs>
  );
}

export { TabsContent };
