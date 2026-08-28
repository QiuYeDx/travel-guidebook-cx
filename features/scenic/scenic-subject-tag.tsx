"use client";

import type { ScenicSubject } from "@/lib/trip/types";

import { scenicSubjectLabels } from "./scenic-labels";

const SUBJECT_CLASS_NAME =
  "inline-flex whitespace-nowrap rounded-full bg-muted/70 px-2.5 py-1 text-[11px] leading-4 text-muted-foreground";

export function ScenicSubjectTag({ subject }: { subject: ScenicSubject }) {
  return (
    <span data-scenic-subject={subject} className={SUBJECT_CLASS_NAME}>
      {scenicSubjectLabels[subject]}
    </span>
  );
}
