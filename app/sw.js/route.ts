import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import {
  buildOfflineCorePaths,
  createOfflineCacheName,
} from "@/lib/offline/cache-config";
import { buildServiceWorkerSource } from "@/lib/offline/service-worker";

export const dynamic = "force-static";

export function GET() {
  const dayIds = chuanxiTrip.days.map((day) => day.id);
  const source = buildServiceWorkerSource({
    cacheName: createOfflineCacheName(chuanxiTrip.contentVersion),
    corePaths: buildOfflineCorePaths(dayIds),
  });

  return new Response(source, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
    },
  });
}
