"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileTextIcon,
  MapPinnedIcon,
  MountainIcon,
  MountainSnowIcon,
  RouteIcon,
} from "lucide-react";

import { ClipPathTabs } from "@/components/qiuye-ui/clip-path-tabs";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";

const headerNavItems = siteConfig.navItems.map(({ href, label }) => ({
  value: href,
  label,
  icon:
    href === "/" ? (
      <MapPinnedIcon aria-hidden="true" />
    ) : href === "/itinerary" ? (
      <RouteIcon aria-hidden="true" />
    ) : href === "/scenic" ? (
      <MountainIcon aria-hidden="true" />
    ) : (
      <FileTextIcon aria-hidden="true" />
    ),
}));

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const activeNavValue =
    siteConfig.navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
        (item.href === "/itinerary" && pathname.startsWith("/days/")),
    )?.href ?? "/";
  const [selectedNavValue, setSelectedNavValue] =
    React.useState<string>(activeNavValue);

  React.useEffect(() => {
    setSelectedNavValue(activeNavValue);
  }, [activeNavValue]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 md:gap-6">
          <SmoothCorners asChild radius={12} smoothing={0.72}>
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 px-2 py-1 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <MountainSnowIcon className="h-5 w-5 shrink-0 text-primary" />
              <span className="max-w-32 truncate text-sm md:max-w-none md:text-base">
                {siteConfig.shortName}
              </span>
            </Link>
          </SmoothCorners>

          <nav aria-label="主导航" className="hidden md:block">
            <ClipPathTabs
              ariaLabel="主导航"
              items={headerNavItems}
              value={selectedNavValue}
              onValueChange={(value) => {
                setSelectedNavValue(value);
                router.push(value);
              }}
              size="sm"
              shape="rounded"
              smoothCorners
              transitionMode="continuous"
              activeBackground="var(--foreground)"
              activeForeground="var(--background)"
              inactiveForeground="var(--muted-foreground)"
              listClassName="gap-1"
            />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
