import type { Metadata } from "next";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { ItineraryTimeline } from "@/features/itinerary/itinerary-timeline";

export const metadata: Metadata = {
  title: "行程时间线",
  description: "2026 川西大环线 D0-D9 主线 A 与 B/C 降级方案",
};

export default function ItineraryPage() {
  return (
    <ItineraryTimeline
      trip={chuanxiTrip}
      scenicCatalog={chuanxiScenicCatalog}
    />
  );
}
