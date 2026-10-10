import type { CloudConfiguration } from './readOnlySnapshot';
import { assertNonEmptyCloudBackup, type MigrationBackup } from './migrationSafety';

export async function uploadFirstCloudBackup(
  config: CloudConfiguration,
  accessToken: string,
  backup: MigrationBackup,
): Promise<number> {
  if (!accessToken.trim()) throw new Error('Cloud sign-in required.');
  if (backup.schema !== 'dlv-supabase-preflight-v1') throw new Error('Invalid backup schema.');
  assertNonEmptyCloudBackup(backup);
  const response = await fetch(`${config.url}/rest/v1/rpc/dlv_write_snapshot`, {
    method: 'POST',
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      expected_revision: 0,
      next_collection: backup.collection,
      next_manual_totals: backup.manualTotals,
      next_owned_only: backup.ownedOnly,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Cloud upload failed (HTTP ${response.status}). No local data changed.`);
  const revision: unknown = await response.json();
  if (revision !== 1) throw new Error('Cloud backup already exists or was changed. Nothing was overwritten.');
  return revision;
}
