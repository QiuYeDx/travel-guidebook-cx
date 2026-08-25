import assert from "node:assert/strict";
import test from "node:test";
import { Script } from "node:vm";

import { buildOfflineCorePaths, createOfflineCacheName } from "./cache-config";
import { getOfflineLinkAction } from "./navigation-policy";
import { buildServiceWorkerSource } from "./service-worker";

const dayIds = Array.from({ length: 10 }, (_, index) => `D${index}`);

test("offline core paths cover all daily and parameterized execution pages", () => {
  const paths = buildOfflineCorePaths(dayIds);

  assert.equal(paths.length, new Set(paths).size);
  for (const dayId of dayIds) {
    assert.ok(paths.includes(`/days/${dayId}`));
  }
  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/itinerary"));
  assert.ok(paths.includes("/guidebook"));
  assert.ok(paths.includes("/safety"));
  assert.ok(paths.includes("/scenic?day=D9"));
  assert.ok(paths.includes("/icon-192.png"));
  assert.ok(paths.includes("/icon-512.png"));
  assert.equal(paths.includes("/scenic?day=D0"), false);
});

test("offline links use cached documents, block web exits, and preserve phone calls", () => {
  const currentUrl = "https://roadbook.example/days/D3";

  assert.deepEqual(
    getOfflineLinkAction(
      "https://uri.amap.com/search?keyword=test",
      currentUrl,
    ),
    { kind: "block-external" },
  );
  assert.deepEqual(getOfflineLinkAction("tel:120", currentUrl), {
    kind: "allow",
  });
});

test("offline cache names are versioned and reject empty versions", () => {
  assert.equal(createOfflineCacheName("0.2"), "chuanxi-roadbook-v0.2");
  assert.equal(
    createOfflineCacheName(" 2026 / final "),
    "chuanxi-roadbook-v2026-final",
  );
  assert.throws(() => createOfflineCacheName("  "), /must not be empty/);
  assert.throws(
    () => buildOfflineCorePaths(["D0", "tomorrow"]),
    /Invalid offline day id/,
  );
});

test("service worker source keeps updates explicit and caches only same-origin GETs", () => {
  const source = buildServiceWorkerSource({
    cacheName: createOfflineCacheName("0.2"),
    corePaths: buildOfflineCorePaths(dayIds),
  });

  assert.match(source, /Promise\.allSettled/);
  assert.match(source, /request\.mode === "navigate"/);
  assert.match(source, /url\.origin !== self\.location\.origin/);
  assert.match(source, /event\.data\?\.type === "SKIP_WAITING"/);
  assert.doesNotMatch(source, /geolocation|当前位置|实时位置/);
  assert.doesNotThrow(() => new Script(source));
});
