import { CATEGORIES } from '../domain/categories';
import type { CategoryId, GameDatabase, GameItem, SavePayload } from '../domain/types';

export const STORAGE_KEY = 'dlv_guide_v6';
const EMPTY_SAVE: SavePayload = {
  data: {},
  checked: {},
  nextId: {},
  ingredients: {},
  owned: {},
  deletedIds: {},
};

function cloneSave(payload: SavePayload): SavePayload {
  return JSON.parse(JSON.stringify(payload)) as SavePayload;
}

function ensureCategoryShape(save: SavePayload, defaults: GameDatabase): SavePayload {
  const next = cloneSave(save);

  CATEGORIES.forEach(({ id }) => {
    next.data[id] ??= [];
    next.checked[id] ??= {};
    next.owned[id] ??= {};
    next.ingredients[id] ??= {};
    next.deletedIds[id] ??= {};

    const localItems = next.data[id] ?? [];
    const localById = new Map(localItems.map((item) => [item.id, item]));

    for (const item of defaults[id] ?? []) {
      if (!localById.has(item.id) && !next.deletedIds[id]?.[item.id]) {
        localItems.push({ ...item });
      } else {
        const existing = localById.get(item.id);
        if (existing) existing.meta2 = item.meta2 ?? existing.meta2 ?? '';
      }
    }

    next.data[id] = localItems.sort(sortItems);
    next.nextId[id] = getNextId(localItems);
  });

  return next;
}

export function loadSave(defaults: GameDatabase): SavePayload {
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
        savedAt: parsed.savedAt,
      },
      defaults,
    );
  } catch {
    return ensureCategoryShape(EMPTY_SAVE, defaults);
  }
}

export function persistSave(save: SavePayload): void {
  const payload: SavePayload = {
    data: save.data,
    checked: save.checked,
    nextId: save.nextId,
    ingredients: save.ingredients,
    owned: save.owned,
    deletedIds: save.deletedIds,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function buildPortableData(save: SavePayload): string {
  return JSON.stringify(
    {
      data: save.data,
      owned: save.owned,
      checked: save.checked,
      nextId: save.nextId,
      ingredients: save.ingredients,
      deletedIds: save.deletedIds,
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
      savedAt: imported.savedAt ?? current.savedAt,
    },
    {},
  );
}

export function upsertSyncedItems(save: SavePayload, categoryId: CategoryId, incoming: GameItem[]): SavePayload {
  const next = cloneSave(save);
  const items = next.data[categoryId] ?? [];
  const byName = new Map(items.map((item) => [item.name.toLowerCase(), item]));

  for (const item of incoming) {
    const existing = byName.get(item.name.toLowerCase());
    if (!existing) {
      const id = next.nextId[categoryId] ?? getNextId(items);
      items.push({ ...item, id });
      next.nextId[categoryId] = id + 1;
      continue;
    }
    existing.meta = item.meta ?? existing.meta;
    existing.meta2 = item.meta2 ?? existing.meta2;
    existing.image = item.image ?? existing.image;
    existing.sourceUrl = item.sourceUrl ?? existing.sourceUrl;
    existing.updatedAt = item.updatedAt;
  }

  next.data[categoryId] = items.sort(sortItems);
  next.nextId[categoryId] = getNextId(next.data[categoryId] ?? []);
  return next;
}

export function getNextId(items: GameItem[]): number {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

export function sortItems(a: GameItem, b: GameItem): number {
  return (
    (a.meta ?? '').localeCompare(b.meta ?? '') ||
    (a.meta2 ?? '').localeCompare(b.meta2 ?? '') ||
    a.name.localeCompare(b.name)
  );
}
