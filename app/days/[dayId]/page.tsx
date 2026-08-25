import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { DayGuide } from "@/features/itinerary/day-guide";
import {
  buildDayItinerary,
  getTripDayIds,
} from "@/features/itinerary/itinerary-model";

type DayPageProps = {
  params: Promise<{ dayId: string }>;
};

export function generateStaticParams() {
  return getTripDayIds(chuanxiTrip).map((dayId) => ({ dayId }));
}

export async function generateMetadata({
  params,
}: DayPageProps): Promise<Metadata> {
  const { dayId } = await params;
  const day = chuanxiTrip.days.find((item) => item.id === dayId);
  if (!day) return {};
  return {
    title: `${day.id} ${day.title}`,
    description: day.primaryGoal,
  };
}

export default async function DayPage({ params }: DayPageProps) {
  const { dayId } = await params;
  const itinerary = buildDayItinerary(chuanxiTrip, chuanxiScenicCatalog, dayId);
  if (!itinerary) notFound();
  return <DayGuide itinerary={itinerary} />;
}
