import type { Metadata } from "next";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { ScenicDayIndex } from "@/features/itinerary/scenic-day-index";

export const metadata: Metadata = {
  title: "观景清单",
  description: "按 D1-D9 行驶顺序查看深圳往返川西短环线的停靠点与车览走廊",
};

export default function ScenicPage() {
  return (
    <ScenicDayIndex
      catalog={chuanxiScenicCatalog}
      trip={chuanxiTrip}
    />
  );
}
