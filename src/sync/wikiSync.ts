import { CATEGORIES } from '../domain/categories';
import type { CategoryId, GameItem, SyncReport } from '../domain/types';
import { normalizeText, titleFromPageName } from '../lib/text';

const API = 'https://dreamlightvalleywiki.com/w/api.php';
const PAGE_BASE = 'https://dreamlightvalleywiki.com/';

interface WikiSearchResult {
  title: string;
}

export async function fetchCategoryItems(categoryId: CategoryId): Promise<GameItem[]> {
  const category = CATEGORIES.find((entry) => entry.id === categoryId);
  if (!category) return [];

  const pages = await searchWiki(category.wikiPage);
  const seen = new Set<string>();
  return pages
    .map((page, index) => {
      const name = titleFromPageName(page.title);
      const key = normalizeText(name);
      if (!key || seen.has(key)) return null;
      seen.add(key);
      return {
        id: index + 1,
        name,
        meta: category.label,
        meta2: '',
        sourceUrl: PAGE_BASE + encodeURIComponent(page.title.replaceAll(' ', '_')),
        updatedAt: new Date().toISOString(),
      } satisfies GameItem;
    })
    .filter(Boolean) as GameItem[];
}

export function createEmptySyncReport(): SyncReport {
  return { added: 0, updated: 0, skipped: 0, errors: [], syncedAt: new Date().toISOString() };
}

async function searchWiki(query: string): Promise<WikiSearchResult[]> {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srlimit: '100',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(`${API}?${params.toString()}`);
  if (!response.ok) throw new Error(`Wiki request failed with ${response.status}`);
  const payload = (await response.json()) as { query?: { search?: WikiSearchResult[] } };
  return payload.query?.search ?? [];
}
