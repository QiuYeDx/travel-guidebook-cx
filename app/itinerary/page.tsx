import type { Metadata } from "next";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { ItineraryTimeline } from "@/features/itinerary/itinerary-timeline";

export const metadata: Metadata = {
  title: "行程时间线",
  description: "2026 成都往返川西大环线 D1-D7 最终行程",
};

export default function ItineraryPage() {
  return (
    <ItineraryTimeline
      trip={chuanxiTrip}
      scenicCatalog={chuanxiScenicCatalog}
    />
  );
}
