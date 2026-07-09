import type { SavePayload } from '../domain/types';
import { buildPortableData } from './saveSystem';

export function downloadSave(save: SavePayload): void {
  const blob = new Blob([buildPortableData(save)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dlv-guide-save-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readImportedFile(file: File): Promise<Partial<SavePayload>> {
  const text = await file.text();
  return JSON.parse(text) as Partial<SavePayload>;
}
