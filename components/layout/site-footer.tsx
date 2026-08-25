import Link from "next/link";
import { MountainSnowIcon } from "lucide-react";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mb-14 border-t bg-muted/30 md:mb-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MountainSnowIcon className="h-4 w-4" />
          <span>
            {siteConfig.name} &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:justify-end">
          <Link
            href="/guidebook"
            className="hover:text-foreground hover:underline"
          >
            完整攻略
          </Link>
          <Link href="/about" className="hover:text-foreground hover:underline">
            项目说明
          </Link>
          <span>动态信息以最后复核为准</span>
        </div>
      </div>
    </footer>
  );
}
