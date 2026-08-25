import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpenTextIcon,
  CalendarClockIcon,
  ListTreeIcon,
} from "lucide-react";

import { MarkdownRenderer } from "@/components/content/markdown-renderer";
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
      <nav
        aria-label="面包屑"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link className="hover:text-foreground" href="/">
          总览
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">完整攻略</span>
      </nav>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-14">
        <article className="min-w-0 max-w-3xl">
          <div className="mb-7 flex flex-wrap items-center gap-2 border-b pb-5">
            <Badge variant="secondary">
              <BookOpenTextIcon />
              正式路书 v{guidebook.version}
            </Badge>
            <Badge variant="outline">
              <CalendarClockIcon />
              更新于 {guidebook.lastUpdated}
            </Badge>
          </div>

          <details className="mb-8 border-y py-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
              <ListTreeIcon className="size-4" />
              本页目录
            </summary>
            <TableOfContents
              className="mt-3 max-h-80 overflow-y-auto border-t pt-3"
              entries={guidebook.tableOfContents}
            />
          </details>

          <MarkdownRenderer content={guidebook.content} />
        </article>

        <aside className="hidden min-w-0 border-l pl-6 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ListTreeIcon className="size-4 text-muted-foreground" />
              本页目录
            </div>
            <TableOfContents entries={guidebook.tableOfContents} />
          </div>
        </aside>
      </div>
    </div>
  );
}
