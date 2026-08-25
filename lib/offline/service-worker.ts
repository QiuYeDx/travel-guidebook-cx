import { OFFLINE_CACHE_PREFIX } from "./cache-config";

export function buildServiceWorkerSource({
  cacheName,
  corePaths,
}: {
  cacheName: string;
  corePaths: readonly string[];
}): string {
  return `const CACHE_NAME = ${JSON.stringify(cacheName)};
const CACHE_PREFIX = ${JSON.stringify(OFFLINE_CACHE_PREFIX)};
const CORE_PATHS = ${JSON.stringify(corePaths)};
const NAVIGATION_TIMEOUT_MS = 4000;

function isCacheable(response) {
  return response && response.ok && response.type !== "opaque";
}

function sameOriginUrl(value, base) {
  try {
    const url = new URL(value, base);
    return url.origin === self.location.origin ? url : undefined;
  } catch {
    return undefined;
  }
}

async function cacheAsset(cache, url) {
  const cached = await cache.match(url);
  if (cached) return;

  const response = await fetch(url, { cache: "reload" });
  if (!isCacheable(response)) return;
  await cache.put(url, response.clone());

  if (response.headers.get("content-type")?.includes("text/css")) {
    const css = await response.text();
    const dependencies = [...css.matchAll(/url\\((?:["']?)([^"')]+)(?:["']?)\\)/g)]
      .map((match) => sameOriginUrl(match[1], url))
      .filter(Boolean);
    await Promise.allSettled(
      dependencies.map((dependency) => cacheAsset(cache, dependency.toString())),
    );
  }
}

async function cachePageAndAssets(cache, path) {
  const request = new Request(path, { cache: "reload" });
  const response = await fetch(request);
  if (!isCacheable(response)) return;
  await cache.put(request, response.clone());

  if (!response.headers.get("content-type")?.includes("text/html")) return;
  const html = await response.text();
  const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => sameOriginUrl(match[1], self.location.origin))
    .filter((url) => url && (url.pathname.startsWith("/_next/static/") || url.pathname === "/favicon.ico"));
  await Promise.allSettled(
    assets.map((asset) => cacheAsset(cache, asset.toString())),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
      CORE_PATHS.map((path) => cachePageAndAssets(cache, path)),
    );
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NAVIGATION_TIMEOUT_MS);
  try {
    const response = await fetch(request, { signal: controller.signal });
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const url = new URL(request.url);
    return (
      (await cache.match(request)) ||
      (await cache.match(url.pathname)) ||
      (await cache.match("/")) ||
      Response.error()
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheable(response)) {
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/sw.js") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || url.pathname === "/favicon.ico") {
    event.respondWith(cacheFirstAsset(request));
  }
});
`;
}
