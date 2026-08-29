"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenTextIcon, FileTextIcon, MapPinnedIcon } from "lucide-react";

import { ClipPathTabs } from "@/components/qiuye-ui/clip-path-tabs";
import { preserveDayGuideTabForNav } from "@/features/itinerary/day-guide-state";

const navItems = [
  { value: "/", label: "总览", icon: <MapPinnedIcon aria-hidden="true" /> },
  {
    value: "/itinerary",
    label: "行程",
    icon: <BookOpenTextIcon aria-hidden="true" />,
  },
  {
    value: "/scenic",
    label: "观景",
    icon: <MapPinnedIcon aria-hidden="true" />,
  },
  {
    value: "/guidebook",
    label: "文档",
    icon: <FileTextIcon aria-hidden="true" />,
  },
];

export function MobileTripNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const activeNavValue =
    navItems.find(
      (item) =>
        pathname === item.value ||
        (item.value !== "/" && pathname.startsWith(`${item.value}/`)) ||
        (item.value === "/itinerary" && pathname.startsWith("/days/")),
    )?.value ?? "/";
  const [selectedNavValue, setSelectedNavValue] =
    React.useState(activeNavValue);

  React.useEffect(() => {
    setSelectedNavValue(activeNavValue);
  }, [activeNavValue]);

  return (
    <nav
      aria-label="移动端主导航"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-[max(0.5rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ClipPathTabs
        ariaLabel="移动端主导航"
        items={navItems}
        value={selectedNavValue}
        onValueChange={setSelectedNavValue}
        onItemClick={(value) => {
          setSelectedNavValue(value);
          router.push(
            preserveDayGuideTabForNav(
              value,
              window.location.pathname,
              window.location.search,
            ),
          );
        }}
        size="sm"
        shape="rounded"
        smoothCorners
        transitionMode="continuous"
        fullWidth
        activeBackground="var(--foreground)"
        activeForeground="var(--background)"
        inactiveForeground="var(--muted-foreground)"
        className="w-full"
        listClassName="h-14 items-center gap-1 py-1"
        triggerClassName="mx-1 h-11 w-auto rounded-lg px-2 [&>span]:flex-col [&>span]:gap-0.5 [&>span]:leading-none [&>span>span:last-child]:text-[0.6875rem]"
        activeItemClassName="mx-1 h-11 w-auto self-center rounded-lg px-2 [&>span]:flex-col [&>span]:gap-0.5 [&>span]:leading-none [&>span>span:last-child]:text-[0.6875rem]"
      />
    </nav>
  );
}
