import type {
  FallbackTrigger,
  ScenicCatalog,
  ScenicDayPlan,
  ScenicItem,
  Trip,
  TripDay,
} from "@/lib/trip/types";

export type DayItinerary = {
  day: TripDay;
  previousDay?: TripDay;
  nextDay?: TripDay;
  scenicPlan?: ScenicDayPlan;
  scenicItems: ScenicItem[];
  distanceKmEstimate?: [number, number];
  driveMinutesEstimate?: [number, number];
  timePriority?: FallbackTrigger;
  parkingBudgetLabel: string;
  degradeAction?: string;
};

function getScenicPlan(
  catalog: ScenicCatalog,
  dayId: string,
): ScenicDayPlan | undefined {
  return catalog.dayPlans.find((plan) => plan.dayId === dayId);
}

export function getScenicItemsForDay(
  catalog: ScenicCatalog,
  dayId: string,
): ScenicItem[] {
  const plan = getScenicPlan(catalog, dayId);
  if (plan?.mode === "reuse" && plan.reuse) {
    const byId = new Map(catalog.items.map((item) => [item.id, item]));
    return plan.reuse.itemIds.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  }

  return catalog.items
    .filter((item) => item.dayId === dayId)
    .sort((a, b) => a.sequence - b.sequence);
}

function formatParkingBudget(plan?: ScenicDayPlan): string {
  if (!plan) return "当日无公路观景停靠计划";
  if (plan.mode === "scenic-transit") return "按景区交通与体力取舍";
  if (!plan.photoStopBudget) return "按当天条件取舍";

  const [minimum, maximum] = plan.photoStopBudget;
  if (minimum === 0) return `最多 ${maximum} 次`;
  if (minimum === maximum) return `${maximum} 次`;
  return `${minimum}-${maximum} 次`;
}

function addRanges(
  values: Array<[number, number] | undefined>,
): [number, number] | undefined {
  const ranges = values.filter(
    (value): value is [number, number] => value !== undefined,
  );
  if (ranges.length === 0) return undefined;
  return ranges.reduce<[number, number]>(
    (total, value) => [total[0] + value[0], total[1] + value[1]],
    [0, 0],
  );
}

export function buildDayItinerary(
  trip: Trip,
  catalog: ScenicCatalog,
  dayId: string,
): DayItinerary | undefined {
  const index = trip.days.findIndex((day) => day.id === dayId);
  if (index === -1) return undefined;

  const day = trip.days[index];
  const scenicPlan = getScenicPlan(catalog, dayId);
  const scenicItems = getScenicItemsForDay(catalog, dayId);
  const timePriority = day.fallbackTriggers.find(
    (trigger) => trigger.category === "time",
  );
  const hasRoadStopBudget =
    scenicPlan?.mode === "road-stops" || scenicPlan?.mode === "reuse";

  return {
    day,
    previousDay: trip.days[index - 1],
    nextDay: trip.days[index + 1],
    scenicPlan,
    scenicItems,
    distanceKmEstimate: addRanges(
      day.legs.map((leg) => leg.distanceKmEstimate),
    ),
    driveMinutesEstimate: addRanges(
      day.legs.map((leg) => leg.driveMinutesEstimate),
    ),
    timePriority,
    parkingBudgetLabel: formatParkingBudget(scenicPlan),
    degradeAction: hasRoadStopBudget
      ? "达到停车预算或预计到店时间收紧后，其余候选自动改为车览，不为补拍夜驾。"
      : undefined,
  };
}

export function getTripDayIds(trip: Trip): string[] {
  return trip.days.map((day) => day.id);
}
