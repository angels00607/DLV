import type { GameItem } from '../domain/types';

// Zone assignments supplied by the user on 23 October 2026.
export const ETERNITY_FURNITURE_TARGETS = [
  {
    "name": "Adirondack Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Adirondack_Chair"
  },
  {
    "name": "Ancient Canoe",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient_Canoe"
  },
  {
    "name": "Ancient Gear Corner Tile",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient_Gear_Corner_Tile"
  },
  {
    "name": "Ancient Gear Tile",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient_Gear_Tile"
  },
  {
    "name": "Ancient's Fish Vehicle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient%27s_Fish_Vehicle"
  },
  {
    "name": "Ancient's Landing Wall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient%27s_Landing_Wall"
  },
  {
    "name": "Ancient's Wooden Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ancient%27s_Wooden_Lamppost"
  },
  {
    "name": "Anna Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Anna_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Anna Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Anna_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Art Deco Column",
    "sourceUrl": "https://dreamlightvalleywiki.com/Art_Deco_Column"
  },
  {
    "name": "Art Deco Glass Shelves",
    "sourceUrl": "https://dreamlightvalleywiki.com/Art_Deco_Glass_Shelves"
  },
  {
    "name": "Art Deco Stand",
    "sourceUrl": "https://dreamlightvalleywiki.com/Art_Deco_Stand"
  },
  {
    "name": "Bamboo Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bamboo_Bench"
  },
  {
    "name": "Barbecue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Barbecue"
  },
  {
    "name": "Basic Canvas",
    "sourceUrl": "https://dreamlightvalleywiki.com/Basic_Canvas"
  },
  {
    "name": "Bird's Nest",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bird%27s_Nest"
  },
  {
    "name": "Black and White Flower Disk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_and_White_Flower_Disk"
  },
  {
    "name": "Black and White Flower Rectangle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_and_White_Flower_Rectangle"
  },
  {
    "name": "Black and White Parasol",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_and_White_Parasol"
  },
  {
    "name": "Blue Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue_Ancient%27s_Lamppost"
  },
  {
    "name": "Blue Bivouac Tent",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue_Bivouac_Tent"
  },
  {
    "name": "Blue, Green, and Purple Flower Disk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue,_Green,_and_Purple_Flower_Disk"
  },
  {
    "name": "Blue, Green, and Purple Flower Rectangle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue,_Green,_and_Purple_Flower_Rectangle"
  },
  {
    "name": "Broken Stone Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Broken_Stone_Pillar"
  },
  {
    "name": "Broken Stone Wall Corner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Broken_Stone_Wall_Corner"
  },
  {
    "name": "Cactus Grove",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cactus_Grove"
  },
  {
    "name": "Cinderella Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cinderella_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Cinderella Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cinderella_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Clay Cooking Stove",
    "sourceUrl": "https://dreamlightvalleywiki.com/Clay_Cooking_Stove"
  },
  {
    "name": "Clay Jug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Clay_Jug"
  },
  {
    "name": "Cogsworth Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cogsworth_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Cogsworth Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cogsworth_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Colorful Glass Tub",
    "sourceUrl": "https://dreamlightvalleywiki.com/Colorful_Glass_Tub"
  },
  {
    "name": "Cooking Campfire",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cooking_Campfire"
  },
  {
    "name": "Corner Wall Shelf",
    "sourceUrl": "https://dreamlightvalleywiki.com/Corner_Wall_Shelf"
  },
  {
    "name": "Corner Zircon Tiles",
    "sourceUrl": "https://dreamlightvalleywiki.com/Corner_Zircon_Tiles"
  },
  {
    "name": "Covered Canoe",
    "sourceUrl": "https://dreamlightvalleywiki.com/Covered_Canoe"
  },
  {
    "name": "Crumbling Landing Wall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Crumbling_Landing_Wall"
  },
  {
    "name": "Daisy Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Daisy_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Daisy Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Daisy_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Deluxe Beverage Cabinet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Deluxe_Beverage_Cabinet"
  },
  {
    "name": "Donald Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Donald_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Donald Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Donald_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Double Bronze & Blue Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Double_Bronze_%26_Blue_Barrier"
  },
  {
    "name": "Double Bronze & Red Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Double_Bronze_%26_Red_Barrier"
  },
  {
    "name": "Dreamlight Cobra Lily",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dreamlight_Cobra_Lily"
  },
  {
    "name": "Elegant Dining Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Dining_Chair"
  },
  {
    "name": "Elegant Piano Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Piano_Bench"
  },
  {
    "name": "Elegant Round Dining Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Round_Dining_Table"
  },
  {
    "name": "Elsa Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elsa_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Elsa Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elsa_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "EVE Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/EVE_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "EVE Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/EVE_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Fireworks Mount",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fireworks_Mount"
  },
  {
    "name": "Flynn Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flynn_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Flynn Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flynn_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Forky Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Forky_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Forky Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Forky_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Gaston Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gaston_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Gaston Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gaston_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Gaston's Antler Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gaston%27s_Antler_Chair"
  },
  {
    "name": "Gaston's Archery Stand",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gaston%27s_Archery_Stand"
  },
  {
    "name": "Gaston's Portrait",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gaston%27s_Portrait"
  },
  {
    "name": "Giant Hourglass",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Hourglass"
  },
  {
    "name": "Gold Bumblestone Block",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gold_Bumblestone_Block"
  },
  {
    "name": "Golden Eel Trophy",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Eel_Trophy"
  },
  {
    "name": "Golden Piranha Trophy",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Piranha_Trophy"
  },
  {
    "name": "Golden Prisma Shrimp Trophy",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Prisma_Shrimp_Trophy"
  },
  {
    "name": "Goofy Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Goofy_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Goofy Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Goofy_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Green Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Ancient%27s_Lamppost"
  },
  {
    "name": "Green Bivouac Tent",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Bivouac_Tent"
  },
  {
    "name": "Green Bumblestone Block",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Bumblestone_Block"
  },
  {
    "name": "Green Cobra Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Cobra_Statue"
  },
  {
    "name": "Green Leafy Trellis",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Leafy_Trellis"
  },
  {
    "name": "Hanging Brasero",
    "sourceUrl": "https://dreamlightvalleywiki.com/Hanging_Brasero"
  },
  {
    "name": "Iago Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Iago_Statue"
  },
  {
    "name": "Jafar Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Jafar_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Jafar Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Jafar_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Kristoff Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Kristoff_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Kristoff Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Kristoff_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Large Black Bivouac Tent",
    "sourceUrl": "https://dreamlightvalleywiki.com/Large_Black_Bivouac_Tent"
  },
  {
    "name": "Large Blue Market Stall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Large_Blue_Market_Stall"
  },
  {
    "name": "Large Heap of Riches",
    "sourceUrl": "https://dreamlightvalleywiki.com/Large_Heap_of_Riches"
  },
  {
    "name": "Large Red Market Stall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Large_Red_Market_Stall"
  },
  {
    "name": "Laugh Canister",
    "sourceUrl": "https://dreamlightvalleywiki.com/Laugh_Canister"
  },
  {
    "name": "LeFou Coconut Bust",
    "sourceUrl": "https://dreamlightvalleywiki.com/LeFou_Coconut_Bust"
  },
  {
    "name": "Lumiere Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lumiere_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Lumiere Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lumiere_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Luminescent Flower Disk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Luminescent_Flower_Disk"
  },
  {
    "name": "Luminescent Flower Rectangle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Luminescent_Flower_Rectangle"
  },
  {
    "name": "Medium Heap of Riches",
    "sourceUrl": "https://dreamlightvalleywiki.com/Medium_Heap_of_Riches"
  },
  {
    "name": "Merlin Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Merlin_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Merlin Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Merlin_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Metallic Flagstone Tile",
    "sourceUrl": "https://dreamlightvalleywiki.com/Metallic_Flagstone_Tile"
  },
  {
    "name": "Mickey Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mickey_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Mickey Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mickey_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Mickey's Steamboat",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mickey%27s_Steamboat"
  },
  {
    "name": "Mike Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mike_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Mike Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mike_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Minnie Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Minnie_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Minnie Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Minnie_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Moana Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Moana_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Moana Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Moana_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Nala Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Nala_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Nala Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Nala_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Olaf Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Olaf_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Olaf Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Olaf_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Orange Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Ancient%27s_Lamppost"
  },
  {
    "name": "Orange BBQ Tools",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_BBQ_Tools"
  },
  {
    "name": "Orange Cobra Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Cobra_Statue"
  },
  {
    "name": "Orange Flower Disk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Flower_Disk"
  },
  {
    "name": "Orange Flower Rectangle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Flower_Rectangle"
  },
  {
    "name": "Orange Tea Set",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Tea_Set"
  },
  {
    "name": "Oswald Deco Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswald_Deco_Door"
  },
  {
    "name": "Oswald Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswald_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Oswald Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswald_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Oswald's Car",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswald%27s_Car"
  },
  {
    "name": "Oswaldian Alarm Clock",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswaldian_Alarm_Clock"
  },
  {
    "name": "Oswaldian Trolley",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oswaldian_Trolley"
  },
  {
    "name": "Papasan Swing Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Papasan_Swing_Chair"
  },
  {
    "name": "Paper Lantern (2)",
    "sourceUrl": "https://dreamlightvalleywiki.com/Paper_Lantern_(2)"
  },
  {
    "name": "Pink and White Cactus Grove",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_and_White_Cactus_Grove"
  },
  {
    "name": "Pink Cactus Pot",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Cactus_Pot"
  },
  {
    "name": "Polished Chandelier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Polished_Chandelier"
  },
  {
    "name": "Prism & Pedestal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Prism_%26_Pedestal"
  },
  {
    "name": "Pumbaa Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pumbaa_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Pumbaa Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pumbaa_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Purple Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Ancient%27s_Lamppost"
  },
  {
    "name": "Purple Cactus Pot",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Cactus_Pot"
  },
  {
    "name": "Purple Cobra Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Cobra_Statue"
  },
  {
    "name": "Purple Leafy Trellis",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Leafy_Trellis"
  },
  {
    "name": "Purple Tea Set",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Tea_Set"
  },
  {
    "name": "Rafiki Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rafiki_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Rafiki Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rafiki_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Ralph Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ralph_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Ralph Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ralph_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Rapunzel Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rapunzel_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Rapunzel Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rapunzel_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Rapunzel's Art Class Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rapunzel%27s_Art_Class_Banner"
  },
  {
    "name": "Red Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Ancient%27s_Lamppost"
  },
  {
    "name": "Red BBQ Tools",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_BBQ_Tools"
  },
  {
    "name": "Red Cobra Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Cobra_Statue"
  },
  {
    "name": "Regal Desk (2)",
    "sourceUrl": "https://dreamlightvalleywiki.com/Regal_Desk_(2)"
  },
  {
    "name": "Regal Side Table (2)",
    "sourceUrl": "https://dreamlightvalleywiki.com/Regal_Side_Table_(2)"
  },
  {
    "name": "Remy Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Remy_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Remy Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Remy_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Retro Future Coffee Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Retro_Future_Coffee_Table"
  },
  {
    "name": "Retro Future Plant Shelves",
    "sourceUrl": "https://dreamlightvalleywiki.com/Retro_Future_Plant_Shelves"
  },
  {
    "name": "Round Orange Bivouac Tent",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_Orange_Bivouac_Tent"
  },
  {
    "name": "Round White Basket",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_White_Basket"
  },
  {
    "name": "Royal Vizier's Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Royal_Vizier%27s_Chair"
  },
  {
    "name": "Sand Fountain",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sand_Fountain"
  },
  {
    "name": "Scar Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scar_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Scar Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scar_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Scrooge Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scrooge_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Scrooge Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scrooge_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Shallow Orange Basket",
    "sourceUrl": "https://dreamlightvalleywiki.com/Shallow_Orange_Basket"
  },
  {
    "name": "Shallow Yellow Basket",
    "sourceUrl": "https://dreamlightvalleywiki.com/Shallow_Yellow_Basket"
  },
  {
    "name": "Short Ancient Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Short_Ancient_Pillar"
  },
  {
    "name": "Simba Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Simba_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Simba Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Simba_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Single Bronze & Blue Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Single_Bronze_%26_Blue_Barrier"
  },
  {
    "name": "Single Bronze & Red Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Single_Bronze_%26_Red_Barrier"
  },
  {
    "name": "Single Iron Post",
    "sourceUrl": "https://dreamlightvalleywiki.com/Single_Iron_Post"
  },
  {
    "name": "Small Blue Market Stall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Blue_Market_Stall"
  },
  {
    "name": "Small Broken Stone Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Broken_Stone_Pillar"
  },
  {
    "name": "Small Broken Stone Wall Corner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Broken_Stone_Wall_Corner"
  },
  {
    "name": "Small Golden Brasero",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Golden_Brasero"
  },
  {
    "name": "Small Heap of Riches",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Heap_of_Riches"
  },
  {
    "name": "Small Red Market Stall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Red_Market_Stall"
  },
  {
    "name": "Small Wall Shelf",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Wall_Shelf"
  },
  {
    "name": "Stitch Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stitch_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Stitch Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stitch_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Stone Jacuzzi",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Jacuzzi"
  },
  {
    "name": "Stony Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stony_Bench"
  },
  {
    "name": "Sulley Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sulley_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Sulley Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sulley_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Sundrop Cloche",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sundrop_Cloche"
  },
  {
    "name": "Sundrop Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sundrop_Rug"
  },
  {
    "name": "Tall Ancient Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tall_Ancient_Pillar"
  },
  {
    "name": "Tall Clay Jar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tall_Clay_Jar"
  },
  {
    "name": "The Fairy Godmother Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/The_Fairy_Godmother_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "The Fairy Godmother — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/The_Fairy_Godmother_%E2%80%94_Purple_Base"
  },
  {
    "name": "Timebending Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Timebending_Table"
  },
  {
    "name": "Tower Fireplace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tower_Fireplace"
  },
  {
    "name": "Tropical Companion Home",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tropical_Companion_Home"
  },
  {
    "name": "Tropical Wood Floor",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tropical_Wood_Floor"
  },
  {
    "name": "Tropical Wood Floor — Corner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tropical_Wood_Floor_%E2%80%94_Corner"
  },
  {
    "name": "Ursine Monarch Throne",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ursine_Monarch_Throne"
  },
  {
    "name": "Ursula Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ursula_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "Ursula Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ursula_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "Vintage Rotary Phone",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Rotary_Phone"
  },
  {
    "name": "Vizier's Alchemy Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vizier%27s_Alchemy_Table"
  },
  {
    "name": "Vizier's Lab Machine",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vizier%27s_Lab_Machine"
  },
  {
    "name": "Wall Shelf",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wall_Shelf"
  },
  {
    "name": "WALL-E Figurine — Celestial Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/WALL-E_Figurine_%E2%80%94_Celestial_Base"
  },
  {
    "name": "WALL-E Figurine — Purple Base",
    "sourceUrl": "https://dreamlightvalleywiki.com/WALL-E_Figurine_%E2%80%94_Purple_Base"
  },
  {
    "name": "White Cactus Pot",
    "sourceUrl": "https://dreamlightvalleywiki.com/White_Cactus_Pot"
  },
  {
    "name": "Yellow Ancient's Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Ancient%27s_Lamppost"
  },
  {
    "name": "Yellow and Purple Cactus Grove",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_and_Purple_Cactus_Grove"
  },
  {
    "name": "Yellow BBQ Tools",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_BBQ_Tools"
  },
  {
    "name": "Yellow Cactus Pot",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Cactus_Pot"
  },
  {
    "name": "Yellow Cobra Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Cobra_Statue"
  },
  {
    "name": "Yellow Flower Disk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Flower_Disk"
  },
  {
    "name": "Yellow Flower Rectangle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Flower_Rectangle"
  },
  {
    "name": "Zircon Tiles",
    "sourceUrl": "https://dreamlightvalleywiki.com/Zircon_Tiles"
  }
];

function canonicalSource(value: string): string {
  try { return decodeURIComponent(value.split(/[?#]/)[0]); }
  catch { return value; }
}
const names = new Set(ETERNITY_FURNITURE_TARGETS.map(item => item.name));
const sources = new Set(ETERNITY_FURNITURE_TARGETS.map(item => canonicalSource(item.sourceUrl)));

export function isEternityFurniture(item: GameItem): boolean {
  return item.sourceUrl ? sources.has(canonicalSource(item.sourceUrl)) : names.has(item.name.replaceAll('’', "'"));
}

export function correctEternityFurnitureZone(item: GameItem): void {
  if (isEternityFurniture(item)) item.meta2 = 'ETERNITY ISLE';
}

