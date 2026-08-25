import type { TableOfContentsEntry } from "@/lib/content/types";
import { cn } from "@/lib/utils";

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
                "block rounded px-2 py-1.5 text-sm leading-5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground",
                entry.depth === 3 && "pl-5 text-xs",
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
