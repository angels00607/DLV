import { CATEGORIES } from '../domain/categories';
import type { CategoryId, GameItem, SavePayload } from '../domain/types';

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

function ensureCategoryShape(save: SavePayload, defaults: Partial<SavePayload>): SavePayload {
  const next = cloneSave(save);
  const defaultData = defaults.data ?? {};
  const defaultOwned = defaults.owned ?? {};
  const defaultChecked = defaults.checked ?? {};
  const defaultIngredients = defaults.ingredients ?? {};

  CATEGORIES.forEach(({ id }) => {
    next.data[id] ??= [];
    next.checked[id] ??= {};
    next.owned[id] ??= {};
    next.ingredients[id] ??= {};
    next.deletedIds[id] ??= {};

    const localItems = next.data[id] ?? [];
    const localById = new Map(localItems.map((item) => [item.id, item]));

    for (const item of defaultData[id] ?? []) {
      if (!localById.has(item.id) && !next.deletedIds[id]?.[item.id]) {
        localItems.push({ ...item });
      } else {
        const existing = localById.get(item.id);
        if (existing) existing.meta2 = item.meta2 ?? existing.meta2 ?? '';
      }
    }

    for (const [itemId, value] of Object.entries(defaultOwned[id] ?? {})) {
      if (next.owned[id]?.[itemId] === undefined) next.owned[id]![itemId] = value;
    }

    for (const [itemId, value] of Object.entries(defaultChecked[id] ?? {})) {
      if (next.checked[id]?.[itemId] === undefined) next.checked[id]![itemId] = value;
    }

    for (const [itemId, value] of Object.entries(defaultIngredients[id] ?? {})) {
      if (!next.ingredients[id]?.[itemId]) next.ingredients[id]![itemId] = value;
    }

    next.data[id] = sortCatItems(id, localItems);
    next.nextId[id] = getNextId(localItems);
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
      },
      defaults,
    );
  } catch {
    return ensureCategoryShape(EMPTY_SAVE, defaults);
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
      }),
    );
  } catch {
    // Same behavior as the reference app: failed local saves are ignored.
  }
}

export function buildPortableData(save: SavePayload): string {
  return JSON.stringify(
    {
      data: Object.fromEntries(CATEGORIES.map((category) => [category.id, save.data[category.id] ?? []])),
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
