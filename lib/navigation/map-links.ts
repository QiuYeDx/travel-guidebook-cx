import type { RouteLeg, ScenicItem } from "@/lib/trip/types";

const AMAP_SOURCE = "travel-guidebook-cx";

function requireText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label} must not be empty`);
  }
  return normalized;
}

function formatCoordinate(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`Coordinate must be between ${minimum} and ${maximum}`);
  }
  return String(value);
}

export function createAmapSearchUrl(query: string): string {
  const url = new URL("https://uri.amap.com/search");
  url.searchParams.set("keyword", requireText(query, "Map search query"));
  url.searchParams.set("view", "map");
  url.searchParams.set("src", AMAP_SOURCE);
  url.searchParams.set("callnative", "1");
  return url.toString();
}

export function createAmapNavigationUrl({
  lat,
  lng,
  mapQuery,
  coordinateSystem,
}: {
  lat: number;
  lng: number;
  mapQuery: string;
  coordinateSystem: "gcj02";
}): string {
  if (coordinateSystem !== "gcj02") {
    throw new Error("Amap navigation requires GCJ-02 coordinates");
  }

  const longitude = formatCoordinate(lng, -180, 180);
  const latitude = formatCoordinate(lat, -90, 90);
  const destination = `${longitude},${latitude},${requireText(
    mapQuery,
    "Navigation destination",
  )}`;
  const url = new URL("https://uri.amap.com/navigation");
  url.searchParams.set("to", destination);
  url.searchParams.set("mode", "car");
  url.searchParams.set("coordinate", "gaode");
  url.searchParams.set("src", AMAP_SOURCE);
  url.searchParams.set("callnative", "1");
  return url.toString();
}

export function buildRouteLegCopyText(leg: RouteLeg): string {
  const points = [leg.from, ...leg.via, leg.to].map((point) =>
    requireText(point, "Route point"),
  );

  return [
    `路线：${points.join(" → ")}`,
    `地图搜索词：${requireText(leg.navigationQuery, "Map search query")}`,
    "提示：逐点加入车机并复核当天道路；本路书不替代实时导航。",
  ].join("\n");
}

const directionLabels = {
  outbound: "顺行",
  return: "返程",
  both: "双向",
} as const;

export function buildScenicItemCopyText(item: ScenicItem): string {
  const corridor = item.geoRef.kind === "route-interval";
  const lines = [
    `${corridor ? "车览走廊" : "观景条目"}：${requireText(item.title, "Scenic title")}`,
    `行驶方向：${directionLabels[item.direction]}`,
  ];

  if (item.geoRef.kind === "route-interval") {
    lines.push(`区间：${item.geoRef.fromLabel} → ${item.geoRef.toLabel}`);
  } else if (item.geoRef.kind === "exact") {
    lines.push(`地图位置：${item.geoRef.mapQuery}`);
    lines.push(`坐标：${item.geoRef.lng},${item.geoRef.lat}（GCJ-02 / 高德）`);
  } else {
    lines.push(`位置说明：${item.geoRef.reason}`);
  }

  if ("passengerCue" in item) {
    lines.push(`乘客观察：${item.passengerCue}`);
  }
  if (item.parking.parkingNavigationQuery) {
    lines.push(`停车入口：${item.parking.parkingNavigationQuery}`);
  }
  if (item.parking.entryDirectionNote) {
    lines.push(`入口方向：${item.parking.entryDirectionNote}`);
  }
  lines.push(`停车说明：${item.parking.note}`);
  lines.push("安全提示：错过入口或无法安全驶入时继续前行，不倒车、不急刹。");
  return lines.join("\n");
}
