import type { SavePayload } from '../domain/types';

// Phase 1: read-only transport, deliberately disconnected from application state.
// No authentication credentials are stored here and no writes are possible.
export interface CloudSnapshot {
  revision: number;
  schema_version: 1;
  collection: SavePayload;
  manual_totals: Record<string, number>;
  owned_only: boolean;
  updated_at: string;
}

export interface CloudConfiguration {
  url: string;
  publishableKey: string;
}

export function readCloudConfiguration(): CloudConfiguration | null {
  const url = (import.meta.env.VITE_SUPABASE_URL || 'https://skenuigulnonrshkwelu.supabase.co').trim();
  const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_fch6NSx050hyF61mInrQPQ_hzlWW1-_').trim();
  if (!url || !publishableKey) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) return null;
    return { url: parsed.origin, publishableKey };
  } catch {
    return null;
  }
}

export function validateCloudSnapshot(value: unknown): CloudSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid cloud snapshot');
  const row = value as Record<string, unknown>;
  if (!Number.isSafeInteger(row.revision) || (row.revision as number) < 1 || row.schema_version !== 1 ||
    !row.collection || typeof row.collection !== 'object' || Array.isArray(row.collection) ||
    !row.manual_totals || typeof row.manual_totals !== 'object' || Array.isArray(row.manual_totals) ||
    typeof row.owned_only !== 'boolean' || typeof row.updated_at !== 'string') {
    throw new Error('Unsupported cloud snapshot');
  }
  const collection = row.collection as Record<string, unknown>;
  for (const key of ['data', 'owned', 'checked', 'ingredients', 'deletedIds', 'nextId']) {
    if (!collection[key] || typeof collection[key] !== 'object' || Array.isArray(collection[key])) {
      throw new Error('Incomplete cloud collection');
    }
  }
  const totals = row.manual_totals as Record<string, unknown>;
  if (Object.values(totals).some((number) => typeof number !== 'number' || !Number.isSafeInteger(number) || number < 0)) {
    throw new Error('Invalid cloud totals');
  }
  return value as CloudSnapshot;
}

export async function readOwnCloudSnapshot(
  configuration: CloudConfiguration,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CloudSnapshot | null> {
  if (!accessToken.trim()) throw new Error('Sign in before accessing the cloud');
  const response = await fetch(
    `${configuration.url}/rest/v1/dlv_collection_snapshots?select=revision,schema_version,collection,manual_totals,owned_only,updated_at&limit=1`,
    {
      headers: {
        apikey: configuration.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal,
    },
  );
  if (!response.ok) throw new Error(`Cloud read failed (HTTP ${response.status})`);
  const rows: unknown = await response.json();
  if (!Array.isArray(rows) || rows.length > 1) throw new Error('Unexpected cloud response');
  return rows.length ? validateCloudSnapshot(rows[0]) : null;
}
