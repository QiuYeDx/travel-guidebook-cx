import { GithubIcon, MountainSnowIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mb-14 border-t md:mb-0">
      <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 sm:justify-between sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <MountainSnowIcon aria-hidden="true" className="size-3.5" />
          <span>
            {siteConfig.name} &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
          <span>
            作者{" "}
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-emerald-700 hover:underline focus-visible:text-emerald-700 focus-visible:underline focus-visible:outline-none dark:hover:text-emerald-400 dark:focus-visible:text-emerald-400"
            >
              {siteConfig.author.name}
            </a>
          </span>
          <Button asChild size="icon" variant="ghost" className="size-7">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="在 GitHub 查看本项目"
              title="在 GitHub 查看本项目"
            >
              <GithubIcon aria-hidden="true" className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
