import assert from "node:assert/strict";
import test from "node:test";

import type { ChecklistDefinition } from "../../data/trips/2026-chuanxi/checklists";
import { chuanxiChecklists } from "../../data/trips/2026-chuanxi/checklists";
import {
  buildChecklistInstances,
  createChecklistItemKey,
  getChecklistItemKeys,
  getChecklistProgress,
  mergeChecklistState,
  parsePersistedChecklistState,
  resetChecklistItems,
  setChecklistItemChecked,
} from "./checklist-model";

const definitions = [
  {
    id: "pretrip",
    version: 1,
    scope: "pretrip",
    title: "行前",
    description: "",
    items: [{ id: "v1-pack", label: "装车" }],
  },
  {
    id: "departure",
    version: 1,
    scope: "daily-departure",
    title: "出发",
    description: "",
    items: [{ id: "v1-driver", label: "主驾" }],
  },
] satisfies ChecklistDefinition[];

test("the Chuanxi catalog uses unique versioned item IDs", () => {
  const definitionIds = chuanxiChecklists.map((definition) => definition.id);
  assert.equal(new Set(definitionIds).size, definitionIds.length);

  for (const definition of chuanxiChecklists) {
    const itemIds = definition.items.map((item) => item.id);
    assert.equal(new Set(itemIds).size, itemIds.length);
    assert.ok(itemIds.every((itemId) => /^v\d+-/.test(itemId)));
  }
});

test("builds stable trip + checklist + item keys for each day", () => {
  const instances = buildChecklistInstances(definitions, ["D0", "D1"]);
  assert.deepEqual(
    instances.map((item) => item.instanceId),
    ["pretrip", "departure.D0", "departure.D1"],
  );
  assert.deepEqual(getChecklistItemKeys("trip", instances), [
    "trip::pretrip::v1-pack",
    "trip::departure.D0::v1-driver",
    "trip::departure.D1::v1-driver",
  ]);
});

test("parses valid state and rejects malformed or unsupported snapshots", () => {
  assert.equal(parsePersistedChecklistState("not-json"), null);
  assert.equal(
    parsePersistedChecklistState(
      JSON.stringify({
        schemaVersion: 2,
        contentVersion: "1",
        checkedItemKeys: [],
      }),
    ),
    null,
  );
  assert.deepEqual(
    parsePersistedChecklistState(
      JSON.stringify({
        schemaVersion: 1,
        contentVersion: "0.9",
        checkedItemKeys: ["a", "a"],
      }),
    ),
    { schemaVersion: 1, contentVersion: "0.9", checkedItemKeys: ["a"] },
  );
});

test("content upgrades preserve matching IDs and leave new items unchecked", () => {
  const oldKey = createChecklistItemKey("trip", "pretrip", "v1-pack");
  const removedKey = createChecklistItemKey("trip", "pretrip", "v1-removed");
  const newKey = createChecklistItemKey("trip", "pretrip", "v2-new");
  const merged = mergeChecklistState(
    {
      schemaVersion: 1,
      contentVersion: "0.9",
      checkedItemKeys: [oldKey, removedKey],
    },
    [oldKey, newKey],
    "1.0",
  );

  assert.deepEqual(merged, {
    schemaVersion: 1,
    contentVersion: "1.0",
    checkedItemKeys: [oldKey],
  });
});

test("toggle, scoped reset and progress calculations are immutable", () => {
  const first = "trip::departure.D1::v1-driver";
  const second = "trip::departure.D1::v1-road";
  const otherDay = "trip::departure.D2::v1-driver";
  const initial = mergeChecklistState(null, [first, second, otherDay], "1.0");
  const checked = setChecklistItemChecked(initial, first, true);
  const checkedAgain = setChecklistItemChecked(checked, otherDay, true);

  assert.deepEqual(initial.checkedItemKeys, []);
  assert.deepEqual(
    getChecklistProgress(checkedAgain.checkedItemKeys, [first, second]),
    {
      checked: 1,
      total: 2,
      percent: 50,
    },
  );
  assert.deepEqual(
    resetChecklistItems(checkedAgain, [first, second]).checkedItemKeys,
    [otherDay],
  );
});
