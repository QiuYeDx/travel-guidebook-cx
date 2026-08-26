"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenTextIcon, EllipsisIcon, MapPinnedIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function NavLink({ href, label, active, icon: Icon }: { href: string; label: string; active: boolean; icon: typeof MapPinnedIcon }) {
  return <Link href={href} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground")}><Icon className="size-5" aria-hidden="true" />{label}</Link>;
}

export function MobileTripNavigation() {
  const pathname = usePathname();
  const moreActive = pathname.startsWith("/guidebook");
  const links = [
    { href: "/guidebook", label: "完整攻略", icon: BookOpenTextIcon },
  ];

  return <nav aria-label="移动端主导航" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background/95 px-[max(0.5rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
    <NavLink href="/" label="总览" active={pathname === "/"} icon={MapPinnedIcon} />
    <NavLink href="/itinerary" label="行程" active={pathname.startsWith("/itinerary") || pathname.startsWith("/days/")} icon={BookOpenTextIcon} />
    <NavLink href="/scenic" label="观景" active={pathname.startsWith("/scenic")} icon={MapPinnedIcon} />
    <Popover>
      <PopoverTrigger asChild><button type="button" className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium", moreActive ? "text-foreground" : "text-muted-foreground")}><EllipsisIcon className="size-5" aria-hidden="true" />更多</button></PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={10} className="w-56 rounded-xl p-2 shadow-xl">
        <div className="grid gap-1">{links.map((item) => <Link key={item.href} href={item.href} className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"><item.icon className="size-4 text-muted-foreground" aria-hidden="true" />{item.label}</Link>)}</div>
        <div className="mt-2 flex items-center justify-between border-t px-3 pt-2 text-sm text-muted-foreground">主题 <ThemeToggle /></div>
      </PopoverContent>
    </Popover>
  </nav>;
}
