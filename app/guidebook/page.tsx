import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BookOpenTextIcon,
  CalendarClockIcon,
  ListTreeIcon,
} from "lucide-react";

import { MarkdownRenderer } from "@/components/content/markdown-renderer";
import { GuidebookMobileToc } from "@/components/content/guidebook-mobile-toc";
import { ScrollEdgeFades } from "@/components/content/scroll-edge-fades";
import { TableOfContents } from "@/components/content/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getPrimaryGuidebook } from "@/lib/content/guidebook";

export async function generateMetadata(): Promise<Metadata> {
  const guidebook = await getPrimaryGuidebook();
  if (!guidebook) return {};

  return {
    title: guidebook.title,
    description: guidebook.description,
  };
}

export default async function GuidebookPage() {
  const guidebook = await getPrimaryGuidebook();
  if (!guidebook) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-14">
        <article className="min-w-0 max-w-3xl">
          <MarkdownRenderer
            content={guidebook.content}
            headingMeta={
              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary">
                  <BookOpenTextIcon />
                  正式路书 v{guidebook.version}
                </Badge>
                <Badge variant="outline">
                  <CalendarClockIcon />
                  更新于 {guidebook.lastUpdated}
                </Badge>
              </div>
            }
          />
        </article>

        <aside className="hidden min-w-0 border-l pl-6 lg:block">
          <div className="sticky top-20">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ListTreeIcon className="size-4 text-muted-foreground" />
              本页目录
            </div>
            <ScrollEdgeFades
              ariaLabel="本页目录"
              axis="vertical"
              role="region"
              viewportClassName="max-h-[calc(100vh-8.5rem)] pb-8"
            >
              <TableOfContents entries={guidebook.tableOfContents} />
            </ScrollEdgeFades>
          </div>
        </aside>
      </div>
      <GuidebookMobileToc entries={guidebook.tableOfContents} />
    </div>
  );
}
