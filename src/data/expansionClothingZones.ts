import type { GameItem } from '../domain/types';

// Explicit user-provided zone assignments, 22 October 2026.
export const EXPANSION_CLOTHING_ZONES: Record<string, string> = {
  "3D Glasses": "ETERNITY ISLE",
  "Artist's Painted Overalls": "ETERNITY ISLE",
  "Flynn-spired Overalls": "ETERNITY ISLE",
  "Gaston's Pompadour": "ETERNITY ISLE",
  "Gaston's Red Leather Coat": "ETERNITY ISLE",
  "Glowing Floral Gown": "ETERNITY ISLE",
  "Glowing Floral Suit": "ETERNITY ISLE",
  "Jeweled Vizier Top": "ETERNITY ISLE",
  "Jeweled Vizier Trousers": "ETERNITY ISLE",
  "Oswaldian Black and White Fedora": "ETERNITY ISLE",
  "Oswaldian Fedora": "ETERNITY ISLE",
  "Oswaldian Zoot Suit": "ETERNITY ISLE",
  "Red Vizier Loafers": "ETERNITY ISLE",
  "Retro Statement Glasses": "ETERNITY ISLE",
  "Retro-tastic Jacket": "ETERNITY ISLE",
  "Retro-tastic Minidress": "ETERNITY ISLE",
  "Trolley Conductor Hat": "ETERNITY ISLE",
  "\"Only One\" Tigger Jersey": "WISHBLOSSOM MOUNTAINS",
  "Alpine Hair Net": "WISHBLOSSOM MOUNTAINS",
  "Arendellian Riding Helmet": "WISHBLOSSOM MOUNTAINS",
  "Arendellian Riding Outfit": "WISHBLOSSOM MOUNTAINS",
  "Black, White, and Chic All Over Hat": "WISHBLOSSOM MOUNTAINS",
  "Black, White, and Chic All Over Jacket": "WISHBLOSSOM MOUNTAINS",
  "Chic Equestrian Uniform": "WISHBLOSSOM MOUNTAINS",
  "Cropped Arendellian Riding Outfit": "WISHBLOSSOM MOUNTAINS",
  "Dream Earrings": "WISHBLOSSOM MOUNTAINS",
  "Flowering Alpine Ensemble": "WISHBLOSSOM MOUNTAINS",
  "Guardian Emblem Helmet": "WISHBLOSSOM MOUNTAINS",
  "Mountainous Adventure Wear": "WISHBLOSSOM MOUNTAINS",
  "Mythical Emblem Helmet": "WISHBLOSSOM MOUNTAINS",
  "Pixie Engineer Outfit": "WISHBLOSSOM MOUNTAINS",
  "Pixie Goggles": "WISHBLOSSOM MOUNTAINS",
  "Radiant Emblem Helmet": "WISHBLOSSOM MOUNTAINS",
  "Tigger Tail": "WISHBLOSSOM MOUNTAINS",
  "Tigger-Striped Pants": "WISHBLOSSOM MOUNTAINS",
  "Tiggerific Bucket Hat": "WISHBLOSSOM MOUNTAINS"
};

export function correctExpansionClothingZone(item: GameItem): void {
  const zone = EXPANSION_CLOTHING_ZONES[item.name.replaceAll('’', "'")];
  if (zone) item.meta2 = zone;
}
