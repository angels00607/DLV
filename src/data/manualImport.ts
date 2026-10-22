import type { SavePayload } from '../domain/types';
import { buildPortableData } from './saveSystem';

export function downloadSave(save: SavePayload, manualTotals: Record<string, number> = {}, ownedOnly = false): void {
  const blob = new Blob([JSON.stringify({ ...JSON.parse(buildPortableData(save, manualTotals)), ownedOnly })], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dlv-guide-save-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readImportedFile(file: File): Promise<Partial<SavePayload>> {
  if (file.size > 20_000_000) throw new Error('Backup exceeds the 20 MB safety limit.');
  const value: unknown = JSON.parse(await file.text());
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      !('data' in value) || !value.data || typeof value.data !== 'object' || Array.isArray(value.data)) {
    throw new Error('Invalid collection file. Use Import complete backup for a full cloud backup.');
  }
  return value as Partial<SavePayload>;
}
