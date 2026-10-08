import type { CategoryId, GameItem, SavePayload } from '../domain/types';

/**
 * Opt-in migration helper. Does not mutate its input, storage, or bundled catalog.
 * Do not call automatically on app startup: old checked and owned states have
 * different meanings, and the user must be able to preview the conversion.
 */
export interface CollectionMigrationPreview {
  collection: SavePayload;
  included: Partial<Record<CategoryId, number>>;
  excluded: Partial<Record<CategoryId, number>>;
  ambiguous: Partial<Record<CategoryId, number>>;
}

export function previewOwnedOnlyMigration(
  original: SavePayload,
  includeCheckedWithoutOwned = false,
): CollectionMigrationPreview {
  const collection: SavePayload = JSON.parse(JSON.stringify(original));
  const included: CollectionMigrationPreview['included'] = {};
  const excluded: CollectionMigrationPreview['excluded'] = {};
  const ambiguous: CollectionMigrationPreview['ambiguous'] = {};
  for (const [category, sourceItems] of Object.entries(original.data) as [CategoryId, GameItem[]][]) {
    const owned = original.owned[category] ?? {};
    const checked = original.checked[category] ?? {};
    const selected = sourceItems.filter((item) => {
      if (owned[item.id] === 'owned') return true;
      if (owned[item.id] === 'missing') return false;
      return includeCheckedWithoutOwned && checked[item.id] === true;
    });
    const selectedIds = new Set(selected.map((item) => String(item.id)));
    const uncertain = sourceItems.filter((item) => owned[item.id] === undefined && checked[item.id] === true);
    collection.data[category] = selected.map((item) => ({ ...item }));
    collection.checked[category] = {};
    collection.owned[category] = Object.fromEntries(selected.map((item) => [item.id, 'owned' as const]));
    collection.ingredients[category] = Object.fromEntries(
      Object.entries(original.ingredients[category] ?? {}).filter(([id]) => selectedIds.has(id)),
    );
    // Preserve the original high-water mark: IDs must never be recycled.
    collection.nextId[category] = Math.max(
      original.nextId[category] ?? 1,
      ...sourceItems.map((item) => item.id + 1),
      1,
    );
    included[category] = selected.length;
    excluded[category] = sourceItems.length - selected.length;
    ambiguous[category] = uncertain.length;
  }
  return { collection, included, excluded, ambiguous };
}

/** Manual total is independent of number of owned items; warn on overflow. */
export function calculateManualProgress(ownedCount: number, manualTotal: number) {
  if (!Number.isSafeInteger(manualTotal) || manualTotal < 0) {
    throw new Error('Total must be a non-negative whole number');
  }
  return {
    owned: ownedCount,
    total: manualTotal,
    percent: manualTotal === 0 ? 0 : Math.min(100, (ownedCount / manualTotal) * 100),
    exceedsTotal: ownedCount > manualTotal,
  };
}
