import type {
  ChecklistDefinition,
  ChecklistScope,
} from "@/data/trips/2026-chuanxi/checklists";

export const checklistStorageSchemaVersion = 1;

export type PersistedChecklistState = {
  schemaVersion: typeof checklistStorageSchemaVersion;
  contentVersion: string;
  checkedItemKeys: string[];
};

export type ChecklistInstance = ChecklistDefinition & {
  instanceId: string;
  dayId?: string;
};

export function createChecklistStorageKey(tripId: string): string {
  return `travel-guidebook:checklists:${tripId}`;
}

export function createChecklistItemKey(
  tripId: string,
  checklistId: string,
  itemId: string,
): string {
  return `${tripId}::${checklistId}::${itemId}`;
}

export function createChecklistInstanceId(
  definition: ChecklistDefinition,
  dayId?: string,
): string {
  if (definition.scope === "pretrip") return definition.id;
  if (!dayId) throw new Error(`Checklist ${definition.id} requires a dayId`);
  return `${definition.id}.${dayId}`;
}

export function buildChecklistInstances(
  definitions: ChecklistDefinition[],
  dayIds: string[],
): ChecklistInstance[] {
  return definitions.flatMap((definition) => {
    if (definition.scope === "pretrip") {
      return [{ ...definition, instanceId: definition.id }];
    }

    return dayIds.map((dayId) => ({
      ...definition,
      instanceId: createChecklistInstanceId(definition, dayId),
      dayId,
    }));
  });
}

export function getChecklistItemKeys(
  tripId: string,
  instances: ChecklistInstance[],
): string[] {
  return instances.flatMap((instance) =>
    instance.items.map((item) =>
      createChecklistItemKey(tripId, instance.instanceId, item.id),
    ),
  );
}

export function parsePersistedChecklistState(
  rawValue: string | null,
): PersistedChecklistState | null {
  if (!rawValue) return null;

  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== "object") return null;

    const candidate = value as Partial<PersistedChecklistState>;
    if (
      candidate.schemaVersion !== checklistStorageSchemaVersion ||
      typeof candidate.contentVersion !== "string" ||
      !Array.isArray(candidate.checkedItemKeys) ||
      candidate.checkedItemKeys.some((item) => typeof item !== "string")
    ) {
      return null;
    }

    return {
      schemaVersion: checklistStorageSchemaVersion,
      contentVersion: candidate.contentVersion,
      checkedItemKeys: [...new Set(candidate.checkedItemKeys)],
    };
  } catch {
    return null;
  }
}

export function mergeChecklistState(
  persisted: PersistedChecklistState | null,
  validItemKeys: string[],
  contentVersion: string,
): PersistedChecklistState {
  const validKeys = new Set(validItemKeys);
  return {
    schemaVersion: checklistStorageSchemaVersion,
    contentVersion,
    checkedItemKeys: (persisted?.checkedItemKeys ?? []).filter((key) =>
      validKeys.has(key),
    ),
  };
}

export function setChecklistItemChecked(
  state: PersistedChecklistState,
  itemKey: string,
  checked: boolean,
): PersistedChecklistState {
  const keys = new Set(state.checkedItemKeys);
  if (checked) keys.add(itemKey);
  else keys.delete(itemKey);
  return { ...state, checkedItemKeys: [...keys] };
}

export function resetChecklistItems(
  state: PersistedChecklistState,
  itemKeys: Iterable<string>,
): PersistedChecklistState {
  const resetKeys = new Set(itemKeys);
  return {
    ...state,
    checkedItemKeys: state.checkedItemKeys.filter((key) => !resetKeys.has(key)),
  };
}

export function getChecklistProgress(
  checkedItemKeys: Iterable<string>,
  itemKeys: string[],
): { checked: number; total: number; percent: number } {
  const checkedKeys = new Set(checkedItemKeys);
  const checked = itemKeys.filter((key) => checkedKeys.has(key)).length;
  return {
    checked,
    total: itemKeys.length,
    percent:
      itemKeys.length === 0 ? 0 : Math.round((checked / itemKeys.length) * 100),
  };
}

export function getInstancesByScope(
  instances: ChecklistInstance[],
  scope: ChecklistScope,
  dayId?: string,
): ChecklistInstance[] {
  return instances.filter(
    (instance) =>
      instance.scope === scope &&
      (scope === "pretrip" || instance.dayId === dayId),
  );
}
