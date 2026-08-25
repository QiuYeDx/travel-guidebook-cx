import type {
  ParkingLevel,
  ScenicSubject,
  TravelDirection,
  VerificationStatus,
  ViewpointKind,
  ViewpointPriority,
} from "@/lib/trip/types";

export const scenicPriorityLabels = {
  core: "核心",
  optional: "可选",
  "drive-by": "车览",
} satisfies Record<ViewpointPriority, string>;

export const scenicParkingLabels = {
  P0: "正式停车体系",
  P1: "观景区待复核",
  P2: "仅现场判断",
  prohibited: "禁止停车",
  "transit-only": "仅景交",
  "walk-only": "仅步行",
} satisfies Record<ParkingLevel, string>;

export const scenicDirectionLabels = {
  outbound: "去程",
  return: "返程",
  both: "双向",
} satisfies Record<TravelDirection, string>;

export const scenicVerificationLabels = {
  verified: "已复核",
  "needs-review": "待复核",
  expired: "已过期",
} satisfies Record<VerificationStatus, string>;

export const scenicSubjectLabels = {
  "snow-mountain": "雪山",
  mountain: "山地",
  valley: "峡谷",
  road: "公路",
  grassland: "草原",
  river: "河流",
  wetland: "湿地",
  village: "村落",
  town: "城镇",
  forest: "森林",
  lake: "湖泊",
  geology: "地貌",
  architecture: "建筑",
  culture: "人文",
} satisfies Record<ScenicSubject, string>;

export const scenicKindLabels = {
  viewpoint: "观景点",
  "scenic-shuttle": "景交站",
  "town-stop": "城镇停靠",
  candidate: "候选点",
} satisfies Record<ViewpointKind, string>;
