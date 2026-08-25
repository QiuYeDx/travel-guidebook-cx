import { chuanxiPlanningSnapshot } from "@/data/trips/2026-chuanxi/planning";
import { chuanxiSources } from "@/data/trips/2026-chuanxi/sources";
import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { chuanxiScenicCatalog } from "@/data/trips/2026-chuanxi/viewpoints";
import { buildTripOverview } from "@/features/trip/overview-model";
import { PlanningDashboard } from "@/features/trip/planning-dashboard";
import { TripHome } from "@/features/trip/trip-home";

export default function Home() {
  const overview = buildTripOverview(
    chuanxiTrip,
    chuanxiScenicCatalog,
    chuanxiSources,
    chuanxiPlanningSnapshot,
  );

  return (
    <TripHome
      trip={chuanxiTrip}
      scenicCatalog={chuanxiScenicCatalog}
      sources={chuanxiSources}
      planningView={
        <PlanningDashboard
          overview={overview}
          planning={chuanxiPlanningSnapshot}
          trip={chuanxiTrip}
        />
      }
    />
  );
}
