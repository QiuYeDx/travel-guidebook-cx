export const dayGuideTabs = ["overview", "route", "notes"] as const;

export type DayGuideTab = (typeof dayGuideTabs)[number];

export function normalizeDayGuideTab(value: unknown): DayGuideTab {
  return dayGuideTabs.includes(value as DayGuideTab)
    ? (value as DayGuideTab)
    : "overview";
}

export function buildDayHref(dayId: string, tab: DayGuideTab): string {
  const params = new URLSearchParams({ tab });
  return `/days/${encodeURIComponent(dayId)}?${params.toString()}`;
}

export function buildScenicHref(dayId: string, returnTab: DayGuideTab): string {
  const params = new URLSearchParams({ day: dayId, returnTab });
  return `/scenic?${params.toString()}`;
}

export function preserveDayGuideTabForNav(
  href: string,
  pathname: string,
  search: string,
): string {
  const match = /^\/days\/([^/]+)$/.exec(pathname);
  if (!match) return href;

  const tab = normalizeDayGuideTab(new URLSearchParams(search).get("tab"));
  if (href === "/itinerary") {
    return `/itinerary?${new URLSearchParams({ tab }).toString()}`;
  }
  if (href === "/scenic") {
    return buildScenicHref(decodeURIComponent(match[1]), tab);
  }
  return href;
}
