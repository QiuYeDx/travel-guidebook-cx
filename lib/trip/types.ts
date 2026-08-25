export type Freshness = "stable" | "seasonal" | "live";
export type VerificationStatus = "verified" | "needs-review" | "expired";
export type DayStatus = "planned" | "confirmed" | "changed" | "cancelled";
export type Intensity = "low" | "low-medium" | "medium" | "medium-high";

export type SourceRef = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  freshness: Freshness;
  verifiedAt: string;
  reviewAt?: string;
};

export type RouteLeg = {
  id: string;
  from: string;
  to: string;
  via: string[];
  distanceKmEstimate?: [number, number];
  driveMinutesEstimate?: [number, number];
  navigationQuery: string;
  targetArrivalSoc?: number;
  latestArrival?: string;
};

export type FallbackTrigger = {
  id: string;
  category: "health" | "weather" | "road" | "booking" | "vehicle" | "time";
  condition: string;
  action: string;
  severity: "warning" | "switch-plan" | "stop";
};

export type TripDay = {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  status: DayStatus;
  intensity: Intensity;
  overnight: { place: string; altitudeMEstimate?: [number, number] };
  primaryGoal: string;
  legs: RouteLeg[];
  mustDo: string[];
  optional: string[];
  skip: string[];
  fallbackTriggers: FallbackTrigger[];
  sourceIds: string[];
};

export type FallbackPlanDay = {
  date: string;
  routeSummary: string;
  overnight?: string;
  primaryGoal: string;
};

export type FallbackPlan = {
  id: "B" | "C";
  title: string;
  description: string;
  triggerMode: "any" | "all";
  triggers: FallbackTrigger[];
  days: FallbackPlanDay[];
  priorities?: string[];
};

export type Trip = {
  id: string;
  name: string;
  contentVersion: string;
  timezone: "Asia/Shanghai";
  startDate: string;
  endDate: string;
  primaryPlanId: "A";
  days: TripDay[];
  fallbackPlans: FallbackPlan[];
  sourceIds: string[];
};

export type ViewpointKind =
  "viewpoint" | "scenic-shuttle" | "town-stop" | "candidate";
export type ViewpointPriority = "core" | "optional" | "drive-by";
export type ParkingLevel =
  "P0" | "P1" | "P2" | "prohibited" | "transit-only" | "walk-only";
export type TravelDirection = "outbound" | "return" | "both";
export type ScenicSubject =
  | "snow-mountain"
  | "mountain"
  | "valley"
  | "road"
  | "grassland"
  | "river"
  | "wetland"
  | "village"
  | "town"
  | "forest"
  | "lake"
  | "geology"
  | "architecture"
  | "culture";

export type GeoRef =
  | {
      kind: "exact";
      lat: number;
      lng: number;
      coordinateSystem: "gcj02";
      mapQuery: string;
      verifiedAt: string;
    }
  | {
      kind: "route-interval";
      routeLegId: string;
      fromLabel: string;
      toLabel: string;
    }
  | { kind: "none"; reason: string };

export type ParkingProfile = {
  level: ParkingLevel;
  verificationStatus: VerificationStatus;
  parkingNavigationQuery?: string;
  entryDirectionNote?: string;
  capacityNote?: string;
  note: string;
};

export type Viewpoint = {
  id: `VP-${string}`;
  dayId: string;
  routeLegId?: string;
  sequence: number;
  title: string;
  kind: ViewpointKind;
  priority: ViewpointPriority;
  direction: TravelDirection;
  subjects: ScenicSubject[];
  geoRef: GeoRef;
  parking: ParkingProfile;
  stayMinutesEstimate?: [number, number];
  sourceIds: string[];
};

export type ScenicCorridor = {
  id: `SC-${string}`;
  dayId: string;
  routeLegId: string;
  sequence: number;
  title: string;
  priority: "core" | "drive-by";
  direction: TravelDirection;
  subjects: ScenicSubject[];
  geoRef: Extract<GeoRef, { kind: "route-interval" }>;
  parking: ParkingProfile;
  passengerCue: string;
  sourceIds: string[];
};

export type ScenicItem = Viewpoint | ScenicCorridor;

export type ScenicDayPlan = {
  dayId: string;
  mode: "road-stops" | "scenic-transit" | "reuse";
  photoStopBudget?: [number, number];
  note: string;
  reuse?: {
    sourceDayId: string;
    maxSelections: number;
    itemIds: `VP-${string}`[];
  };
};

export type ScenicCatalog = {
  tripId: string;
  contentVersion: string;
  items: ScenicItem[];
  dayPlans: ScenicDayPlan[];
};

export type PlanningItemStatus = "open" | "in-progress" | "confirmed";

export type PlanningDeadline = {
  date: string;
  label: string;
};

export type PlanningDecision = {
  id: string;
  title: string;
  recommendation: string;
  impact: string;
  status: PlanningItemStatus;
  deadline: PlanningDeadline;
};

export type PlanningTask = {
  id: string;
  title: string;
  note: string;
  status: PlanningItemStatus;
  deadline: PlanningDeadline;
};

export type PlanningSnapshot = {
  tripId: string;
  updatedAt: string;
  decisions: PlanningDecision[];
  tasks: PlanningTask[];
};
