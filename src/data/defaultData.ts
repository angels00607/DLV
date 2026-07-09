import type { SavePayload } from '../domain/types';

export async function fetchDefaultData(): Promise<Partial<SavePayload>> {
  const response = await fetch('/DLV/data.json', { cache: 'no-cache' });
  if (!response.ok) return {};
  return (await response.json()) as Partial<SavePayload>;
}
