"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MountainSnowIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 md:gap-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 font-semibold"
          >
            <MountainSnowIcon className="h-5 w-5 shrink-0 text-primary" />
            <span className="max-w-32 truncate text-sm md:max-w-none md:text-base">{siteConfig.shortName}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:px-3 sm:text-sm",
                  pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
