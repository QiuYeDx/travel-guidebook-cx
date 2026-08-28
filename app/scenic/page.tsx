import type { Metadata } from "next";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { ScenicDayIndex } from "@/features/itinerary/scenic-day-index";

export const metadata: Metadata = {
  title: "观景清单",
  description: "按 D1-D9 行驶顺序查看川西大环线停靠点与车览走廊",
};

export default async function ScenicPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string; item?: string }>;
}) {
  const { day, item } = await searchParams;
  return (
    <ScenicDayIndex
      catalog={chuanxiScenicCatalog}
      selectedDayId={day ?? "D1"}
      selectedItemId={item}
      trip={chuanxiTrip}
    />
  );
}
