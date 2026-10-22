import type { GameItem } from '../domain/types';

// User-approved Clothing zone correction, 22 October 2026.
export const STORYBOOK_CLOTHING_NAMES = [
  "Armor of the Styx",
  "Bard's Cap",
  "Bookish Book Bag",
  "Bookish Signet Ring",
  "Bookworm Glasses",
  "Cap of Song",
  "Chunky Scarf",
  "Cloche Hat",
  "Corinthian Earrings",
  "Dark Fairy Ensemble",
  "Fairytale Armor",
  "Golden Fleece Pants",
  "Green Fingerless Gloves",
  "Hades Merch Tee",
  "Hero of the Vale Coat",
  "Legendary Rogue Boots",
  "Legendary Rogue Outfit",
  "Merida's Curls",
  "Newspaper Dress",
  "Newspaper Jacket",
  "Ocean Swirl Socks",
  "Once Upon a Dream Dress",
  "Origami Paper Mask",
  "Petrified Wood Bracelet",
  "Pocket Watch Necklace",
  "Prince Phillip's Sword and Shield",
  "Queen Iduna Costume Gown",
  "Short Fingerless Gloves",
  "Snippet Wings",
  "Stripy Beach Shorts",
  "Tapestry Skirt",
  "Tartan Celebration Outfit",
  "Underworld Sandals",
  "Vintage Platform Shoes",
  "Wolf of the Wilds' Paws"
];

const names = new Set(STORYBOOK_CLOTHING_NAMES.map(name => name.toLowerCase()));

export function correctStorybookClothingZone(item: GameItem): void {
  if (names.has(item.name.replaceAll('’', "'").toLowerCase())) item.meta2 = 'STORYBOOK VALE';
}
