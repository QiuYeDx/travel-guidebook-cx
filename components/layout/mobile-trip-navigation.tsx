"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenTextIcon, FileTextIcon, MapPinnedIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function NavLink({ href, label, active, icon: Icon }: { href: string; label: string; active: boolean; icon: typeof MapPinnedIcon }) {
  return <Link href={href} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground")}><Icon className="size-5" aria-hidden="true" />{label}</Link>;
}

export function MobileTripNavigation() {
  const pathname = usePathname();

  return <nav aria-label="移动端主导航" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background/95 px-[max(0.5rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
    <NavLink href="/" label="总览" active={pathname === "/"} icon={MapPinnedIcon} />
    <NavLink href="/itinerary" label="行程" active={pathname.startsWith("/itinerary") || pathname.startsWith("/days/")} icon={BookOpenTextIcon} />
    <NavLink href="/scenic" label="观景" active={pathname.startsWith("/scenic")} icon={MapPinnedIcon} />
    <NavLink href="/guidebook" label="文档" active={pathname.startsWith("/guidebook")} icon={FileTextIcon} />
  </nav>;
}
