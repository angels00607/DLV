import { MIGRATION_BACKUP_SCHEMA, type MigrationBackup } from './migrationSafety';

export function parseMigrationBackup(value: unknown): MigrationBackup {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid backup file.');
  const backup = value as Partial<MigrationBackup>;
  if (backup.schema !== MIGRATION_BACKUP_SCHEMA || typeof backup.createdAt !== 'string' ||
      !backup.collection || typeof backup.collection !== 'object' || Array.isArray(backup.collection) ||
      !backup.manualTotals || typeof backup.manualTotals !== 'object' || Array.isArray(backup.manualTotals) ||
      typeof backup.ownedOnly !== 'boolean') throw new Error('Unsupported backup format.');
  const collection = backup.collection as unknown as Record<string, unknown>;
  for (const field of ['data', 'owned', 'checked', 'ingredients', 'deletedIds', 'nextId']) {
    if (!collection[field] || typeof collection[field] !== 'object' || Array.isArray(collection[field])) {
      throw new Error('Backup collection is incomplete.');
    }
  }
  if (Object.values(backup.manualTotals).some(n => typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0)) {
    throw new Error('Backup totals are invalid.');
  }
  return backup as MigrationBackup;
}
