import type { SavePayload } from '../domain/types';

export const MIGRATION_BACKUP_SCHEMA = 'dlv-supabase-preflight-v1';

export interface MigrationBackup {
  schema: typeof MIGRATION_BACKUP_SCHEMA;
  createdAt: string;
  collection: SavePayload;
  manualTotals: Record<string, number>;
  ownedOnly: boolean;
}

export function createMigrationBackup(
  collection: SavePayload,
  manualTotals: Record<string, number>,
  ownedOnly: boolean,
): MigrationBackup {
  return {
    schema: MIGRATION_BACKUP_SCHEMA,
    createdAt: new Date().toISOString(),
    collection: structuredClone(collection),
    manualTotals: { ...manualTotals },
    ownedOnly,
  };
}

export function downloadMigrationBackup(backup: MigrationBackup): void {
  const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `dlv-full-backup-${backup.createdAt.slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}

export interface CollectionComparison {
  localItems: number;
  remoteItems: number;
  localEmptyUniverses: number;
  remoteEmptyUniverses: number;
  localTotalEntries: number;
  remoteTotalEntries: number;
  identical: boolean;
}

export function compareCollections(
  local: MigrationBackup,
  remote: MigrationBackup,
): CollectionComparison {
  const countItems = (save: SavePayload) => Object.values(save.data)
    .reduce((sum, entries) => sum + (entries?.length ?? 0), 0);
  const countUniverses = (save: SavePayload) => Object.values(save.customUniverses ?? {})
    .reduce((sum, entries) => sum + (entries?.length ?? 0), 0);
  // JSON comparisons here are informational only; never auto-merge on this basis.
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  return {
    localItems: countItems(local.collection),
    remoteItems: countItems(remote.collection),
    localEmptyUniverses: countUniverses(local.collection),
    remoteEmptyUniverses: countUniverses(remote.collection),
    localTotalEntries: Object.keys(local.manualTotals).length,
    remoteTotalEntries: Object.keys(remote.manualTotals).length,
    identical: same(local.collection, remote.collection) &&
      same(local.manualTotals, remote.manualTotals) && local.ownedOnly === remote.ownedOnly,
  };
}
