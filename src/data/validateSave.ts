import type { SavePayload } from '../domain/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** Reject malformed backups before any local/cloud write can replace recoverable data. */
export function validateSave(value: unknown): asserts value is SavePayload {
  if (!isRecord(value)) throw new Error('Invalid collection.');
  if (value.catalogMigrationVersion !== undefined && (!Number.isSafeInteger(value.catalogMigrationVersion) || (value.catalogMigrationVersion as number) < 0)) throw new Error('Invalid catalog migration version.');
  for (const field of ['data', 'checked', 'owned', 'ingredients', 'deletedIds', 'nextId']) {
    if (!isRecord(value[field])) throw new Error(`Invalid collection structure: ${field}.`);
  }
  for (const entries of Object.values(value.data as Record<string, unknown>)) {
    if (!Array.isArray(entries)) throw new Error('Invalid collection items.');
    const ids = new Set<number>();
    for (const item of entries) {
      if (!isRecord(item) || !Number.isSafeInteger(item.id) || (item.id as number) < 0 ||
          typeof item.name !== 'string' || ids.has(item.id as number)) throw new Error('Invalid or duplicate collection item ID.');
      ids.add(item.id as number);
      for (const key of ['meta', 'meta2', 'image', 'sourceUrl', 'updatedAt', 'whereToGetOther', 'friendshipQuestCharacter']) {
        if (item[key] !== undefined && typeof item[key] !== 'string') throw new Error(`Invalid item field: ${key}.`);
      }
      for (const key of ['event', 'premiumShop']) {
        if (item[key] !== undefined && typeof item[key] !== 'boolean') throw new Error(`Invalid item field: ${key}.`);
      }
      if (item.stars !== undefined && (!Number.isSafeInteger(item.stars) || (item.stars as number) < 1 || (item.stars as number) > 5)) throw new Error('Invalid item stars.');
      if (item.whereToGet !== undefined && (!Array.isArray(item.whereToGet) || item.whereToGet.some(entry => typeof entry !== 'string'))) throw new Error('Invalid acquisition details.');
    }
  }
  for (const field of ['checked', 'deletedIds', 'owned', 'ingredients']) {
    for (const entries of Object.values(value[field] as Record<string, unknown>)) {
      if (!isRecord(entries)) throw new Error(`Invalid ${field} category.`);
      for (const entry of Object.values(entries)) {
        if ((field === 'checked' || field === 'deletedIds') && typeof entry !== 'boolean') throw new Error(`Invalid ${field} state.`);
        if (field === 'owned' && entry !== 'owned' && entry !== 'missing') throw new Error('Invalid ownership state.');
        if (field === 'ingredients' && (!Array.isArray(entry) || entry.some(ingredient => typeof ingredient !== 'string'))) throw new Error('Invalid recipe ingredients.');
      }
    }
  }
  if (Object.values(value.nextId as Record<string, unknown>).some(id => !Number.isSafeInteger(id) || (id as number) < 1)) throw new Error('Invalid next item ID.');
  if (value.customUniverses !== undefined) {
    if (!isRecord(value.customUniverses)) throw new Error('Invalid custom universes.');
    for (const entries of Object.values(value.customUniverses)) {
      if (!Array.isArray(entries) || entries.some(entry => !isRecord(entry) || typeof entry.name !== 'string' || typeof entry.zone !== 'string')) throw new Error('Invalid custom universe.');
    }
  }
}
