import type { CloudConfiguration } from './readOnlySnapshot';
import { assertNonEmptyCloudBackup, type MigrationBackup } from './migrationSafety';

export async function updateCloudBackup(
  config: CloudConfiguration,
  accessToken: string,
  backup: MigrationBackup,
  expectedRevision: number,
): Promise<number | null> {
  if (!accessToken.trim()) throw new Error('Sign in first.');
  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) throw new Error('Invalid expected revision.');
  if (backup.schema !== 'dlv-supabase-preflight-v1') throw new Error('Invalid backup format.');
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
      expected_revision: expectedRevision,
      next_collection: backup.collection,
      next_manual_totals: backup.manualTotals,
      next_owned_only: backup.ownedOnly,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Cloud update failed (HTTP ${response.status}). Local data unchanged.`);
  const revision: unknown = await response.json();
  if (revision === null) return null;
  if (revision !== expectedRevision + 1) throw new Error('Unexpected cloud revision; verify remote state before retrying.');
  return revision;
}
