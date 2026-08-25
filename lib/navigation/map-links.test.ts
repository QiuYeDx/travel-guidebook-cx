import assert from "node:assert/strict";
import test from "node:test";

import type { ScenicCorridor, Viewpoint } from "@/lib/trip/types";

import {
  buildRouteLegCopyText,
  buildScenicItemCopyText,
  createAmapNavigationUrl,
  createAmapSearchUrl,
} from "./map-links";

test("Amap search URI safely carries Chinese places and multiple waypoints", () => {
  const url = new URL(createAmapSearchUrl("新都桥 → 雅江 → 理塘 → 香格里拉镇"));

  assert.equal(url.origin, "https://uri.amap.com");
  assert.equal(url.pathname, "/search");
  assert.equal(
    url.searchParams.get("keyword"),
    "新都桥 → 雅江 → 理塘 → 香格里拉镇",
  );
  assert.equal(url.searchParams.get("view"), "map");
  assert.equal(url.searchParams.get("callnative"), "1");
  assert.doesNotMatch(url.toString(), /新都桥|香格里拉镇/);
});

test("Amap links reject empty text and invalid coordinates", () => {
  assert.throws(() => createAmapSearchUrl("  "), /must not be empty/);
  assert.throws(
    () =>
      createAmapNavigationUrl({
        lat: 91,
        lng: 101.2,
        coordinateSystem: "gcj02",
        mapQuery: "核准停车入口",
      }),
    /between -90 and 90/,
  );
  assert.throws(
    () =>
      createAmapNavigationUrl({
        lat: 30.1,
        lng: 101.2,
        coordinateSystem: "wgs84" as "gcj02",
        mapQuery: "核准停车入口",
      }),
    /requires GCJ-02/,
  );
});

test("exact parking navigation uses reviewed GCJ-02 coordinates", () => {
  const url = new URL(
    createAmapNavigationUrl({
      lat: 30.123456,
      lng: 101.234567,
      coordinateSystem: "gcj02",
      mapQuery: "同名观景台 东向停车入口",
    }),
  );

  assert.equal(url.pathname, "/navigation");
  assert.equal(
    url.searchParams.get("to"),
    "101.234567,30.123456,同名观景台 东向停车入口",
  );
  assert.equal(url.searchParams.get("mode"), "car");
  assert.equal(url.searchParams.get("coordinate"), "gaode");
});

test("route copy text preserves waypoint order without live position", () => {
  const text = buildRouteLegCopyText({
    id: "LEG-D3-01",
    from: "新都桥",
    to: "香格里拉镇",
    via: ["雅江", "理塘", "稻城"],
    navigationQuery: "新都桥 → 雅江 → 理塘 → 稻城 → 香格里拉镇",
  });

  assert.match(text, /路线：新都桥 → 雅江 → 理塘 → 稻城 → 香格里拉镇/);
  assert.match(text, /不替代实时导航/);
  assert.doesNotMatch(text, /当前位置|实时位置/);
});

test("scenic copy text distinguishes corridors and exact entrances", () => {
  const corridor: ScenicCorridor = {
    id: "SC-D1-TEST",
    dayId: "D1",
    routeLegId: "LEG-D1-01",
    sequence: 10,
    title: "峡谷连续车览",
    priority: "drive-by",
    direction: "outbound",
    subjects: ["valley"],
    geoRef: {
      kind: "route-interval",
      routeLegId: "LEG-D1-01",
      fromLabel: "隧道出口",
      toLabel: "服务区入口",
    },
    parking: {
      level: "prohibited",
      verificationStatus: "verified",
      note: "全程不停车。",
    },
    passengerCue: "右侧观察峡谷。",
    sourceIds: [],
  };
  const viewpoint: Viewpoint = {
    id: "VP-D1-TEST",
    dayId: "D1",
    sequence: 20,
    title: "核准观景台",
    kind: "viewpoint",
    priority: "core",
    direction: "return",
    subjects: ["mountain"],
    geoRef: {
      kind: "exact",
      lat: 30.1,
      lng: 101.2,
      coordinateSystem: "gcj02",
      mapQuery: "核准观景台东门",
      verifiedAt: "2026-09-20",
    },
    parking: {
      level: "P1",
      verificationStatus: "verified",
      parkingNavigationQuery: "核准观景台东门停车入口",
      entryDirectionNote: "仅返程方向顺行驶入。",
      note: "满位直接通过。",
    },
    sourceIds: [],
  };

  const corridorText = buildScenicItemCopyText(corridor);
  assert.match(corridorText, /车览走廊：峡谷连续车览/);
  assert.match(corridorText, /区间：隧道出口 → 服务区入口/);
  assert.match(corridorText, /全程不停车/);

  const viewpointText = buildScenicItemCopyText(viewpoint);
  assert.match(viewpointText, /行驶方向：返程/);
  assert.match(viewpointText, /101\.2,30\.1（GCJ-02 \/ 高德）/);
  assert.match(viewpointText, /仅返程方向顺行驶入/);
  assert.match(viewpointText, /错过入口或无法安全驶入时继续前行/);
});
