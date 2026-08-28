"use client";

import type { ScenicSubject } from "@/lib/trip/types";
import { cn } from "@/lib/utils";

import { scenicSubjectLabels } from "./scenic-labels";

export type ScenicSubjectRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ScenicSubjectRects = Partial<
  Record<ScenicSubject, ScenicSubjectRect>
>;

const SUBJECT_CLASS_NAME =
  "inline-flex whitespace-nowrap rounded-full bg-muted/70 px-2.5 py-1 text-[11px] leading-4 text-muted-foreground";

export function readScenicSubjectRects(root: ParentNode): ScenicSubjectRects {
  const rects: ScenicSubjectRects = {};
  root
    .querySelectorAll<HTMLElement>("[data-scenic-subject]")
    .forEach((element) => {
      const subject = element.dataset.scenicSubject as ScenicSubject | undefined;
      if (!subject || rects[subject]) return;
      const rect = element.getBoundingClientRect();
      rects[subject] = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    });
  return rects;
}

export function ScenicSubjectTag({
  subject,
  invisible = false,
}: {
  subject: ScenicSubject;
  invisible?: boolean;
}) {
  return (
    <span
      data-scenic-subject={subject}
      className={cn(SUBJECT_CLASS_NAME, invisible && "invisible")}
    >
      {scenicSubjectLabels[subject]}
    </span>
  );
}
