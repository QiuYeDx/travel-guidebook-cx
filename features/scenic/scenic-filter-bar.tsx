"use client";

import { RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScenicSubject } from "@/lib/trip/types";

import {
  scenicDirectionLabels,
  scenicParkingLabels,
  scenicPriorityLabels,
  scenicSubjectLabels,
  scenicVerificationLabels,
} from "./scenic-labels";
import type { ScenicFilters } from "./scenic-model";

type FilterOption = { value: string; label: string };

function FilterSelect({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-10 min-w-36" aria-label={label}>
        <span className="text-xs text-muted-foreground">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const priorityOptions: FilterOption[] = [
  { value: "all", label: "全部" },
  ...Object.entries(scenicPriorityLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const parkingOptions: FilterOption[] = [
  { value: "all", label: "全部" },
  ...Object.entries(scenicParkingLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const directionOptions: FilterOption[] = [
  { value: "all", label: "全部" },
  ...Object.entries(scenicDirectionLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const verificationOptions: FilterOption[] = [
  { value: "all", label: "全部" },
  ...Object.entries(scenicVerificationLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

export function ScenicFilterBar({
  filters,
  subjects,
  activeFilterCount,
  onChange,
  onReset,
}: {
  filters: ScenicFilters;
  subjects: ScenicSubject[];
  activeFilterCount: number;
  onChange: (filters: ScenicFilters) => void;
  onReset: () => void;
}) {
  const subjectOptions: FilterOption[] = [
    { value: "all", label: "全部" },
    ...subjects.map((subject) => ({
      value: subject,
      label: scenicSubjectLabels[subject],
    })),
  ];

  return (
    <section aria-labelledby="scenic-filter-title" className="border-y py-4">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="scenic-filter-title"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <SlidersHorizontalIcon
            className="size-4 text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          />
          筛选沿途条目
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {activeFilterCount > 0 ? `${activeFilterCount} 项条件` : "未筛选"}
        </span>
      </div>

      <div className="mt-3 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          <FilterSelect
            label="优先级"
            value={filters.priority}
            options={priorityOptions}
            onValueChange={(priority) =>
              onChange({
                ...filters,
                priority: priority as ScenicFilters["priority"],
              })
            }
          />
          <FilterSelect
            label="停车"
            value={filters.parking}
            options={parkingOptions}
            onValueChange={(parking) =>
              onChange({
                ...filters,
                parking: parking as ScenicFilters["parking"],
              })
            }
          />
          <FilterSelect
            label="拍摄对象"
            value={filters.subject}
            options={subjectOptions}
            onValueChange={(subject) =>
              onChange({
                ...filters,
                subject: subject as ScenicFilters["subject"],
              })
            }
          />
          <FilterSelect
            label="方向"
            value={filters.direction}
            options={directionOptions}
            onValueChange={(direction) =>
              onChange({
                ...filters,
                direction: direction as ScenicFilters["direction"],
              })
            }
          />
          <FilterSelect
            label="复核"
            value={filters.verification}
            options={verificationOptions}
            onValueChange={(verification) =>
              onChange({
                ...filters,
                verification: verification as ScenicFilters["verification"],
              })
            }
          />
          <Button
            type="button"
            variant="outline"
            className="h-10"
            disabled={activeFilterCount === 0}
            onClick={onReset}
          >
            <RotateCcwIcon aria-hidden="true" />
            清除
          </Button>
        </div>
      </div>
    </section>
  );
}
