import { CATEGORIES } from '../domain/categories';
import type { CategoryId, GameItem, SavePayload } from '../domain/types';

export const STORAGE_KEY = 'dlv_guide_v6';
export const COLLECTION_MODE_KEY = 'dlv_collection_owned_only_v1';
export const COLLECTION_BACKUP_KEY = 'dlv_collection_pre_migration_backup_v1';
const EMPTY_SAVE: SavePayload = {
  data: {},
  checked: {},
  nextId: {},
  ingredients: {},
  owned: {},
  deletedIds: {},
  customUniverses: {},
};

function cloneSave(payload: SavePayload): SavePayload {
  return JSON.parse(JSON.stringify(payload)) as SavePayload;
}

export function ensureCategoryShape(save: SavePayload, defaults: Partial<SavePayload>): SavePayload {
  const next = cloneSave(save);
  const defaultData = defaults.data ?? {};
  const defaultOwned = defaults.owned ?? {};
  const defaultChecked = defaults.checked ?? {};
  const defaultIngredients = defaults.ingredients ?? {};

  const collectionMode = localStorage.getItem(COLLECTION_MODE_KEY) === '1';
  CATEGORIES.forEach(({ id }) => {
    next.data[id] ??= [];
    next.checked[id] ??= {};
    next.owned[id] ??= {};
    next.ingredients[id] ??= {};
    next.deletedIds[id] ??= {};
    next.customUniverses ??= {};
    next.customUniverses[id] ??= [];

    if (id === 'furniture') {
      const normalize = (item: GameItem) => {
        if (['GENERAL', 'NON-DISNEY RELATEDd'].includes((item.meta ?? '').trim())) item.meta = 'NON-DISNEY RELATED';
      };
      (next.data[id] ?? []).forEach(normalize);
      (defaultData[id] ?? []).forEach(normalize);
      next.customUniverses[id] = Array.from(new Map(
        (next.customUniverses[id] ?? []).map((entry) => {
          const name = ['GENERAL', 'NON-DISNEY RELATEDd'].includes(entry.name.trim())
            ? 'NON-DISNEY RELATED' : entry.name;
          return { ...entry, name };
        }).map((entry) => [JSON.stringify([entry.name, entry.zone]), entry]),
      ).values());
    }
    const localItems = next.data[id] ?? [];
    const localById = new Map(localItems.map((item) => [item.id, item]));

    // Meals and Crafting retain the complete bundled checklist even in owned-only mode.
    // Match by name + universe + zone to avoid overwriting custom entries or reusing IDs.
    const checklist = id === 'meals' || id === 'crafting';
    const mergeBundledCatalog = id === 'clothing' || id === 'furniture';
    const identity = (item: GameItem) => [item.name, item.meta ?? '', item.meta2 ?? ''].map((value) => value.trim().toLocaleLowerCase()).join('\\u0000');
    const known = new Set(localItems.map(identity));
    const furnitureOccurrences = new Map<string, number>();
    if (id === 'furniture') {
      for (const item of localItems) furnitureOccurrences.set(identity(item), (furnitureOccurrences.get(identity(item)) ?? 0) + 1);
    }
    const defaultOccurrences = new Map<string, number>();
    // Deleted bundled items must not be restored during initialization.
    const deletedDefaultIds = next.deletedIds[id] ?? {};
    let nextAvailableId = Math.max(next.nextId[id] ?? 1, getNextId(localItems));
    for (const item of checklist || mergeBundledCatalog ? (defaultData[id] ?? []) : collectionMode ? [] : (defaultData[id] ?? [])) {
      if (deletedDefaultIds[item.id]) continue;
      if (mergeBundledCatalog) {
        // A bundled item's stable ID survives edits to its zone, group or name.
        // Do not re-add the catalog copy after the user has moved or renamed it.
        if (localById.has(item.id)) continue;
        const key = identity(item);
        const occurrence = (defaultOccurrences.get(key) ?? 0) + 1;
        defaultOccurrences.set(key, occurrence);
        // Furniture may legitimately contain multiple items with identical names.
        // Preserve those distinct occurrences while avoiding repeated imports.
        if (id === 'furniture') {
          if (localById.has(item.id)) continue;
          if (occurrence <= (furnitureOccurrences.get(key) ?? 0)) continue;
        } else {
          // Stable IDs take precedence over mutable name/universe/zone.
          // A user moving a bundled clothing item must not resurrect its old copy.
          if (localById.has(item.id) || known.has(key)) continue;
        }
        const newId = localById.has(item.id) ? nextAvailableId++ : item.id;
        const added = { ...item, id: newId };
        localItems.push(added);
        localById.set(newId, added);
        known.add(key);
        nextAvailableId = Math.max(nextAvailableId, newId + 1);
        continue;
      }
      if (checklist) {
        if (known.has(identity(item))) continue;
        // Preserve the original ID only when it is free; never replace a user's item.
        const newId = localById.has(item.id) || item.id < nextAvailableId ? nextAvailableId++ : item.id;
        localItems.push({ ...item, id: newId });
        localById.set(newId, item);
        known.add(identity(item));
        nextAvailableId = Math.max(nextAvailableId, newId + 1);
        continue;
      }
      if (!localById.has(item.id) && !next.deletedIds[id]?.[item.id]) {
        localItems.push({ ...item });
      } else {
        // The user's saved item is authoritative. Never reapply bundled defaults
        // over edited zone, stars or any other field during app startup.
      }
    }

    for (const [itemId, value] of Object.entries(collectionMode ? {} : (defaultOwned[id] ?? {}))) {
      if (next.owned[id]?.[itemId] === undefined) next.owned[id]![itemId] = value;
    }

    for (const [itemId, value] of Object.entries(collectionMode ? {} : (defaultChecked[id] ?? {}))) {
      if (next.checked[id]?.[itemId] === undefined) next.checked[id]![itemId] = value;
    }

    for (const [itemId, value] of Object.entries(collectionMode ? {} : (defaultIngredients[id] ?? {}))) {
      if (!next.ingredients[id]?.[itemId]) next.ingredients[id]![itemId] = value;
    }

    next.data[id] = sortCatItems(id, localItems);
    next.nextId[id] = Math.max(next.nextId[id] ?? 1, getNextId(localItems));
  });

  return next;
}

export function loadSave(defaults: Partial<SavePayload>): SavePayload {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ensureCategoryShape(EMPTY_SAVE, defaults);
    const parsed = JSON.parse(raw) as Partial<SavePayload>;
    return ensureCategoryShape(
      {
        data: parsed.data ?? {},
        checked: parsed.checked ?? {},
        nextId: parsed.nextId ?? {},
        ingredients: parsed.ingredients ?? {},
        owned: parsed.owned ?? {},
        deletedIds: parsed.deletedIds ?? {},
        customUniverses: parsed.customUniverses ?? {},
      },
      defaults,
    );
  } catch (error) {
    // Never silently replace corrupted or unreadable user data with defaults.
    // A later persistence effect would overwrite the only recovery copy.
    throw new Error('Unable to read your saved collection. Local data has NOT been reset.', { cause: error });
  }
}

export function persistSave(save: SavePayload): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data: save.data,
        checked: save.checked,
        nextId: save.nextId,
        ingredients: save.ingredients,
        owned: save.owned,
        deletedIds: save.deletedIds,
        customUniverses: save.customUniverses ?? {},
      }),
    );
  } catch (error) {
    throw new Error('Local save failed. Your recent changes may not survive a reload.', { cause: error });
  }
}

export function buildPortableData(save: SavePayload, manualTotals: Record<string, number> = {}): string {
  return JSON.stringify(
    {
      data: Object.fromEntries(CATEGORIES.map((category) => [category.id, save.data[category.id] ?? []])),
      owned: save.owned,
      checked: save.checked,
      nextId: save.nextId,
      ingredients: save.ingredients,
      deletedIds: save.deletedIds,
      customUniverses: save.customUniverses ?? {},
      manualTotals,
      savedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}

export function mergeImportedSave(current: SavePayload, imported: Partial<SavePayload>): SavePayload {
  return ensureCategoryShape(
    {
      data: imported.data ?? current.data,
      checked: imported.checked ?? current.checked,
      nextId: imported.nextId ?? current.nextId,
      ingredients: imported.ingredients ?? current.ingredients,
      owned: imported.owned ?? current.owned,
      deletedIds: imported.deletedIds ?? current.deletedIds,
      customUniverses: imported.customUniverses ?? current.customUniverses,
    },
    {},
  );
}

export function upsertSyncedItems(save: SavePayload, categoryId: CategoryId, incoming: GameItem[]): SavePayload {
  const next = cloneSave(save);
  const items = next.data[categoryId] ?? [];
  const byName = new Map(items.map((item) => [item.name.toLowerCase(), item]));

  for (const item of incoming) {
    if (next.deletedIds[categoryId]?.[item.id]) continue;
    const existing = byName.get(item.name.toLowerCase());
    if (!existing) {
      const id = next.nextId[categoryId] ?? getNextId(items);
      items.push({ ...item, id });
      next.nextId[categoryId] = id + 1;
      continue;
    }
    existing.meta = item.meta ?? existing.meta;
    existing.meta2 = item.meta2 ?? existing.meta2;
    existing.stars = item.stars ?? existing.stars;
    existing.image = item.image ?? existing.image;
    existing.sourceUrl = item.sourceUrl ?? existing.sourceUrl;
    existing.updatedAt = item.updatedAt;
  }

  next.data[categoryId] = sortCatItems(categoryId, items);
  next.nextId[categoryId] = getNextId(next.data[categoryId] ?? []);
  return next;
}

export function getNextId(items: GameItem[]): number {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

export function sortCatItems(categoryId: CategoryId, items: GameItem[]): GameItem[] {
  return [...items].sort((a, b) => {
    const nameCompare = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    const metaCompare = (a.meta ?? '').toLowerCase().localeCompare((b.meta ?? '').toLowerCase());
    const meta2Compare = (a.meta2 ?? '').toLowerCase().localeCompare((b.meta2 ?? '').toLowerCase());

    if (categoryId === 'clothing' || categoryId === 'furniture') {
      return metaCompare || nameCompare;
    }

    if (categoryId === 'meals') {
      return meta2Compare || metaCompare || nameCompare;
    }

    return metaCompare || meta2Compare || nameCompare;
  });
}
