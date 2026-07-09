import type { GameDatabase, SavePayload } from '../domain/types';

export async function fetchDefaultData(): Promise<GameDatabase> {
  const response = await fetch('/DLV-Guide/data.json', { cache: 'no-cache' });
  if (!response.ok) return {};
  const payload = (await response.json()) as Partial<SavePayload>;
  return payload.data ?? {};
}
