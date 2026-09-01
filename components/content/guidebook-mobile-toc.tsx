"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { smoothCorners } from "@qiuyedx/smooth-corners";
import { ListTreeIcon } from "lucide-react";
import { motion } from "motion/react";

import { ScrollEdgeFades } from "@/components/content/scroll-edge-fades";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TableOfContentsEntry } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const tocItemCorners = smoothCorners(8, 0.7) as CSSProperties;

export function GuidebookMobileToc({
  entries,
}: {
  entries: TableOfContentsEntry[];
}) {
  const [activeId, setActiveId] = useState(entries[0]?.id);
  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (observations) => {
        const visible = observations
          .filter((item) => item.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: [0, 1] },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <div className="fixed inset-x-4 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 md:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-full border bg-background/95 px-4 text-sm font-medium shadow-lg backdrop-blur-xl"
          >
            <ListTreeIcon className="size-4" aria-hidden="true" />
            目录{" "}
            <span className="max-w-44 truncate text-muted-foreground">
              {entries.find((entry) => entry.id === activeId)?.title}
            </span>
          </button>
        </PopoverTrigger>
        <SmoothCorners asChild radius={16} smoothing={0.72}>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={10}
            className="w-[calc(100vw-2rem)] overflow-hidden p-0 shadow-2xl"
          >
            <div className="border-b px-4 py-3 text-sm font-semibold">
              本页目录
            </div>
            <ScrollEdgeFades
              ariaLabel="本页目录"
              axis="vertical"
              role="region"
              viewportClassName="max-h-[min(60vh,28rem)] px-2 py-2"
              startFadeClassName="from-popover via-popover/90"
              endFadeClassName="from-popover via-popover/90"
            >
              <ol className="relative z-0 space-y-1">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <a
                      href={`#${entry.id}`}
                      className={cn(
                        "smooth-corners block px-3 py-2 text-sm leading-5 transition-colors",
                        entry.depth === 3 && "pl-7 text-xs",
                        activeId === entry.id
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                      )}
                      style={tocItemCorners}
                    >
                      <motion.span layout="position">{entry.title}</motion.span>
                    </a>
                  </li>
                ))}
              </ol>
            </ScrollEdgeFades>
          </PopoverContent>
        </SmoothCorners>
      </Popover>
    </div>
  );
}
