import type { Metadata } from "next";

import { chuanxiSources } from "@/data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { SourceCatalog } from "@/features/sources/source-catalog";

export const metadata: Metadata = {
  title: "来源与复核状态",
  description: "查看川西路书事实来源、最近核实日期与下次复核状态",
};

export default function SourcesPage() {
  return <SourceCatalog sources={chuanxiSources} trip={chuanxiTrip} />;
}
