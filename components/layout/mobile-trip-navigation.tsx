"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenTextIcon,
  CalendarDaysIcon,
  CircleHelpIcon,
  ClipboardCheckIcon,
  EllipsisIcon,
  HouseIcon,
  LibraryBigIcon,
  MapPinnedIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useTripMode } from "@/features/trip/trip-mode-provider";
import { cn } from "@/lib/utils";

function MobileNavLink({
  href,
  label,
  active,
  icon: Icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: typeof HouseIcon;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function MobileTripNavigation() {
  const pathname = usePathname();
  const { mode, selectedDayId } = useTripMode();
  const checklistHref =
    mode === "onTrip"
      ? `/checklists?view=daily&day=${selectedDayId}`
      : "/checklists";
  const scenicDayId = selectedDayId === "D0" ? "D1" : selectedDayId;

  return (
    <nav
      aria-label="移动端主导航"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background/95 px-[max(0.5rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <MobileNavLink
        href="/"
        label={mode === "onTrip" ? "今天" : "总览"}
        active={pathname === "/"}
        icon={HouseIcon}
      />
      <MobileNavLink
        href="/itinerary"
        label="行程"
        active={
          pathname.startsWith("/itinerary") || pathname.startsWith("/days/")
        }
        icon={CalendarDaysIcon}
      />
      <MobileNavLink
        href={checklistHref}
        label="清单"
        active={pathname.startsWith("/checklists")}
        icon={ClipboardCheckIcon}
      />
      <details className="group relative">
        <summary
          className={cn(
            "flex min-h-14 cursor-pointer list-none flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium outline-none [&::-webkit-details-marker]:hidden",
            pathname.startsWith("/safety") ||
              pathname.startsWith("/scenic") ||
              pathname.startsWith("/guidebook") ||
              pathname.startsWith("/sources") ||
              pathname.startsWith("/about")
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          <EllipsisIcon className="size-5" aria-hidden="true" />
          更多
        </summary>
        <div className="absolute bottom-[calc(100%+0.5rem)] right-0 w-52 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {[
            {
              href: `/scenic?day=${scenicDayId}`,
              label: "沿途观景",
              icon: MapPinnedIcon,
            },
            {
              href: "/safety",
              label: "安全与紧急联系",
              icon: ShieldAlertIcon,
            },
            {
              href: "/guidebook",
              label: "完整攻略",
              icon: BookOpenTextIcon,
            },
            {
              href: "/sources",
              label: "来源与复核",
              icon: LibraryBigIcon,
            },
            { href: "/about", label: "项目说明", icon: CircleHelpIcon },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-9 items-center gap-2 rounded-sm px-2 text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
            >
              <item.icon
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {item.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-border" />
          <div className="flex min-h-10 items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
            主题
            <ThemeToggle />
          </div>
        </div>
      </details>
    </nav>
  );
}
