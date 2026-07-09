export type CategoryId =
  | 'characters'
  | 'clothing'
  | 'furniture'
  | 'meals'
  | 'crafting'
  | 'ingredients'
  | 'redeemCodes';

export type OwnedState = 'owned' | 'missing';

export interface GameItem {
  id: number;
  name: string;
  meta?: string;
  meta2?: string;
  image?: string;
  sourceUrl?: string;
  updatedAt?: string;
}

export type GameDatabase = Partial<Record<CategoryId, GameItem[]>>;
export type CheckedState = Partial<Record<CategoryId, Record<string, boolean>>>;
export type OwnedMap = Partial<Record<CategoryId, Record<string, OwnedState>>>;
export type IngredientsMap = Partial<Record<CategoryId, Record<string, string[]>>>;
export type DeletedMap = Partial<Record<CategoryId, Record<string, boolean>>>;
export type NextIdMap = Partial<Record<CategoryId, number>>;

export interface SavePayload {
  data: GameDatabase;
  checked: CheckedState;
  nextId: NextIdMap;
  ingredients: IngredientsMap;
  owned: OwnedMap;
  deletedIds: DeletedMap;
  savedAt?: string;
}

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  shortLabel: string;
  icon: string;
  groupBy: Array<keyof GameItem>;
  wikiPage: string;
  supportsIngredients?: boolean;
}

export interface FilterState {
  query: string;
  status: 'all' | 'owned' | 'missing' | 'unchecked';
  universe: string;
  group: string;
}

export interface SyncReport {
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
  syncedAt: string;
}
