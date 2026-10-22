import type { GameItem } from '../domain/types';

// Clothing > GENERAL: user's authoritative Event availability list.
const EVENT_ITEMS = new Set([
  "\"Patchy\" Travel Backpack",
  "Abu & Rajah Character Tee",
  "Alien Character Backpack",
  "Astronomer's Apprentice Backpack",
  "Astronomer's Apprentice Boots",
  "Astronomer's Apprentice Glasses",
  "Basic Toga Dress",
  "Black Cat Ears",
  "Bright Ears Headband",
  "Brown Sliders",
  "D23 Varsity Jacket 2026",
  "Dazzle Ears Headband",
  "Elegant Nightmare Gloves",
  "Embroidered Spring Apron",
  "Formal Scarlet Holiday Blazer",
  "Gilded Royalty Outfit",
  "Gladiator Sandals",
  "Gleam Ears Headband",
  "Glow Ears Headband",
  "Gray Oxfords",
  "Green Witch Boots",
  "Green Witch Gloves",
  "Green Witch Hat",
  "Haunted Festival Dress",
  "Hiking Backpack",
  "Horsey Headband",
  "Illuminate Ears Headband",
  "Jasmine Ear Headband",
  "Joy and Rainbows Sweater",
  "Joyful Flower Sunglasses",
  "Lucky Shirt",
  "Luxurious Buttoned Gloves",
  "Nature's Protector Boots",
  "Olympian Bracelet",
  "Pink Y2K Top",
  "Plague Mask",
  "Printed Winter Leggings",
  "Pumpkin Helmet",
  "Punky Nails",
  "Purple Perfect Petals Dress",
  "Radiate Ears Headband",
  "Rock Star Combat Boots",
  "Rock Star Top",
  "Santa Hat",
  "Shimmer Ears Headband",
  "Shine Ears Headband",
  "Sun and Moon Boots",
  "Sun and Moon Gloves",
  "Taupe Winter Coat",
  "Taupe Winter Hat",
  "Tiki Magic Band",
  "Timeless Holiday Top"
].map((name) => name.toLowerCase()));
const PREMIUM_CORRECTIONS = new Set(['Blue Silk Ruffle Skirt', 'Villainous Charm Necklace']);
const RENAMES: Record<string, string> = {
  'Astronomer’s Apprentice Boots': "Astronomer's Apprentice Boots",
  'Jewel Toned Cottage Dress': 'Jewel-Toned Cottage Dress',
  'Tan (dark) Chino Shorts': 'Tan Chino Shorts',
};

export function reconcileGeneralClothing(item: GameItem): void {
  if (!['GENERAL', 'OTHER (GENERAL)'].includes((item.meta ?? '').trim().toUpperCase())) return;
  item.meta = 'GENERAL';
  item.name = RENAMES[item.name] ?? item.name;
  const event = EVENT_ITEMS.has(item.name.toLowerCase());
  if (event) {
    item.event = true;
    item.premiumShop = false;
  } else if (PREMIUM_CORRECTIONS.has(item.name)) {
    item.event = false;
    item.premiumShop = true;
  }
}
