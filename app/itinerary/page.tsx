import type { Metadata } from "next";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { ItineraryTimeline } from "@/features/itinerary/itinerary-timeline";
import { normalizeDayGuideTab } from "@/features/itinerary/day-guide-state";

export const metadata: Metadata = {
  title: "行程时间线",
  description: "2026 深圳往返川西短环线 D0-D9 最终行程",
};

export default async function ItineraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  return (
    <ItineraryTimeline
      trip={chuanxiTrip}
      scenicCatalog={chuanxiScenicCatalog}
      dayTab={normalizeDayGuideTab(tab)}
    />
  );
}
