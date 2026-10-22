import { validateSave } from './validateSave.ts';
import type { SavePayload } from '../domain/types';
import { STORAGE_KEY, COLLECTION_MODE_KEY } from './saveSystem.ts';

export const MANUAL_TOTALS_STORAGE_KEY = 'dlv_manual_collection_totals_v1';

/** Commit collection + totals + mode together, restoring all keys on any failed write/readback. */
export function replaceLocalBackup(collection: SavePayload, totals: Record<string, number>, ownedOnly: boolean): void {
  validateSave(collection);
  if (typeof ownedOnly !== 'boolean') throw new Error('Invalid collection mode.');
  if (!totals || typeof totals !== 'object' || Array.isArray(totals)) throw new Error('Invalid backup totals.');
  if (Object.values(totals).some(value => !Number.isSafeInteger(value) || value < 0)) throw new Error('Invalid backup totals.');
  const entries = [
    [STORAGE_KEY, JSON.stringify(collection)],
    [MANUAL_TOTALS_STORAGE_KEY, JSON.stringify(totals)],
    [COLLECTION_MODE_KEY, ownedOnly ? '1' : '0'],
  ] as const;
  const previous = entries.map(([key]) => localStorage.getItem(key));
  try {
    for (const [key, value] of entries) localStorage.setItem(key, value);
    for (const [key, value] of entries) {
      if (localStorage.getItem(key) !== value) throw new Error('Backup read-back verification failed.');
    }
  } catch (error) {
    let rollbackFailed = false;
    entries.forEach(([key], index) => {
      try {
        if (previous[index] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previous[index]!);
      } catch { rollbackFailed = true; }
    });
    throw new Error(rollbackFailed
      ? 'Restore failed and browser storage could not be fully rolled back. Keep your downloaded recovery file.'
      : 'Restore failed. Previous local collection, totals and mode were restored.', { cause: error });
  }
}
