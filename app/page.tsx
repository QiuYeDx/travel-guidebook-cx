import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { OverviewDashboard } from "@/features/trip/overview-dashboard";

export default function Home() {
  return <OverviewDashboard trip={chuanxiTrip} scenicCatalog={chuanxiScenicCatalog} />;
}
