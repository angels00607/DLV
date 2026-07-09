import type { CategoryDefinition } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'clothing',
    label: 'Clothing',
    shortLabel: 'Clothes',
    icon: '/DLV-Guide/images/Menu_Icon_Clothing.png',
    groupBy: ['meta', 'meta2'],
    wikiPage: 'Clothing',
  },
  {
    id: 'furniture',
    label: 'Furniture',
    shortLabel: 'Furniture',
    icon: '/DLV-Guide/images/Menu_Icon_Furniture.png',
    groupBy: ['meta', 'meta2'],
    wikiPage: 'Furniture',
  },
  {
    id: 'meals',
    label: 'Meals',
    shortLabel: 'Meals',
    icon: '/DLV-Guide/images/Menu_Icon_Meals.png',
    groupBy: ['meta'],
    wikiPage: 'Meals',
    supportsIngredients: true,
  },
  {
    id: 'crafting',
    label: 'Crafting',
    shortLabel: 'Craft',
    icon: '/DLV-Guide/images/Crafting.png',
    groupBy: ['meta'],
    wikiPage: 'Crafting',
    supportsIngredients: true,
  },
];

export const categoryById = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));
