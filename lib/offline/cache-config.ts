export const OFFLINE_CACHE_PREFIX = "chuanxi-roadbook-";

export function createOfflineCacheName(contentVersion: string): string {
  const normalized = contentVersion.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
  if (!normalized) {
    throw new Error("Offline content version must not be empty");
  }
  return `${OFFLINE_CACHE_PREFIX}v${normalized}`;
}

export function buildOfflineCorePaths(dayIds: readonly string[]): string[] {
  const validDayIds = dayIds.map((dayId) => {
    const normalized = dayId.trim();
    if (!/^D\d+$/.test(normalized)) {
      throw new Error(`Invalid offline day id: ${dayId}`);
    }
    return normalized;
  });

  return [
    "/",
    "/itinerary",
    "/guidebook",
    "/safety",
    "/scenic",
    "/sources",
    "/about",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/icon-192.png",
    "/icon-512.png",
    "/apple-touch-icon.png",
    ...validDayIds.map((dayId) => `/days/${dayId}`),
    ...validDayIds
      .filter((dayId) => dayId !== "D0")
      .map((dayId) => `/scenic?day=${encodeURIComponent(dayId)}`),
  ];
}
