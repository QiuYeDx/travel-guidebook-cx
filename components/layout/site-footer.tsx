import { MountainSnowIcon } from "lucide-react";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MountainSnowIcon className="h-4 w-4" />
          <span>
            {siteConfig.name} &copy; {new Date().getFullYear()}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          路线与预约信息以出发前最后复核为准
        </p>
      </div>
    </footer>
  );
}
