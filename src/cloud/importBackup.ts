import { MIGRATION_BACKUP_SCHEMA, type MigrationBackup } from './migrationSafety';
import { validateCloudSnapshot } from './readOnlySnapshot';

export function parseMigrationBackup(text: string): MigrationBackup {
  if (text.length > 20_000_000) throw new Error('Backup exceeds the 20 MB safety limit.');
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid backup JSON.');
  const backup = value as Partial<MigrationBackup>;
  if (backup.schema !== MIGRATION_BACKUP_SCHEMA || typeof backup.createdAt !== 'string' ||
      Number.isNaN(Date.parse(backup.createdAt))) throw new Error('Unsupported backup format.');
  validateCloudSnapshot({
    revision: 1,
    schema_version: 1,
    collection: backup.collection,
    manual_totals: backup.manualTotals,
    owned_only: backup.ownedOnly,
    updated_at: backup.createdAt,
  });
  return backup as MigrationBackup;
}
