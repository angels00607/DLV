import { validateCloudSnapshot, type CloudConfiguration } from './readOnlySnapshot';
import type { SavePayload } from '../domain/types';

export interface CloudHistoryEntry {
  revision: number;
  schema_version: number;
  archived_at: string;
  collection: SavePayload;
  manual_totals: Record<string, number>;
  owned_only: boolean;
}

export async function readOwnCloudHistory(
  config: CloudConfiguration,
  accessToken: string,
): Promise<CloudHistoryEntry[]> {
  if (!accessToken.trim()) throw new Error('Sign in first.');
  const response = await fetch(
    `${config.url}/rest/v1/dlv_collection_history?select=revision,schema_version,archived_at,collection,manual_totals,owned_only&order=revision.desc&limit=20`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    },
  );
  if (!response.ok) throw new Error(`Cloud history read failed (HTTP ${response.status}).`);
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid cloud history response.');
  return rows.map((row: unknown) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('Invalid history row.');
    const entry = row as Partial<CloudHistoryEntry>;
    if (!Number.isSafeInteger(entry.revision) || !entry.revision || entry.revision < 1 ||
      entry.schema_version !== 1 || typeof entry.archived_at !== 'string' ||
      !entry.collection || typeof entry.collection !== 'object' ||
      !entry.collection.data || typeof entry.collection.data !== 'object' ||
      Array.isArray(entry.collection.data) ||
      !entry.manual_totals || typeof entry.manual_totals !== 'object' || Array.isArray(entry.manual_totals) ||
      Object.values(entry.manual_totals).some(value => !Number.isSafeInteger(value) || value < 0) ||
      typeof entry.owned_only !== 'boolean') throw new Error('Unsupported history row.');
    validateCloudSnapshot({
      revision: entry.revision,
      schema_version: entry.schema_version,
      collection: entry.collection,
      manual_totals: entry.manual_totals,
      owned_only: entry.owned_only,
      updated_at: entry.archived_at,
    });
    return entry as CloudHistoryEntry;
  });
}
