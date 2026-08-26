import type { Intensity, ParkingLevel, ViewpointKind } from "@/lib/trip/types";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  weekday: "short",
  timeZone: "Asia/Shanghai",
});

export const intensityLabels = {
  low: "低",
  "low-medium": "低-中",
  medium: "中",
  "medium-high": "中-高",
} satisfies Record<Intensity, string>;

export const parkingLabels = {
  P0: "可停车",
  P1: "停车待确认",
  P2: "现场判断",
  prohibited: "禁止停车",
  "transit-only": "仅景交",
  "walk-only": "仅步行",
} satisfies Record<ParkingLevel, string>;

export const viewpointKindLabels = {
  viewpoint: "观景点",
  "scenic-shuttle": "景交站",
  "town-stop": "城镇停靠",
  candidate: "候选点",
} satisfies Record<ViewpointKind, string>;

export function formatTripDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T12:00:00+08:00`));
}

export function formatNumberRange(
  value: [number, number] | undefined,
  unit: string,
): string {
  if (!value) return "-";
  return value[0] === value[1]
    ? `${value[0]} ${unit}`
    : `${value[0]}-${value[1]} ${unit}`;
}

export function formatDriveTime(value: [number, number] | undefined): string {
  if (!value) return "-";
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
  };
  return `${formatMinutes(value[0])}-${formatMinutes(value[1])}`;
}
