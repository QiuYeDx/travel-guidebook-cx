import type { CSSProperties } from "react";
import { smoothCorners } from "@qiuyedx/smooth-corners";

import type { TableOfContentsEntry } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const tocLinkCorners = smoothCorners(6, 0.65) as CSSProperties;

export function TableOfContents({
  entries,
  className,
}: {
  entries: TableOfContentsEntry[];
  className?: string;
}) {
  return (
    <nav aria-label="本页目录" className={className}>
      <ol className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "smooth-corners block px-2 py-1.5 text-sm leading-5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground",
                entry.depth === 3 && "pl-5 text-xs",
              )}
              style={tocLinkCorners}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
