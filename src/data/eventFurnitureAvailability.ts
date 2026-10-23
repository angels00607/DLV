import type { GameItem } from '../domain/types';

// Furniture Event list supplied by the user. Source URLs distinguish homonyms.
export const EVENT_FURNITURE_TARGETS: { name: string; sources: string[] }[] = [
  {
    "name": "Belle's Snow Angel",
    "sources": [
      "https://dreamlightvalleywiki.com/Belle%27s_Snow_Angel"
    ]
  },
  {
    "name": "The Beast's Snow Angel",
    "sources": [
      "https://dreamlightvalleywiki.com/The_Beast%27s_Snow_Angel"
    ]
  },
  {
    "name": "Honey Lemon Gaming Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Honey_Lemon_Gaming_Chair"
    ]
  },
  {
    "name": "Neon Koi Lantern",
    "sources": [
      "https://dreamlightvalleywiki.com/Neon_Koi_Lantern"
    ]
  },
  {
    "name": "San Fransokyo Square Archway",
    "sources": [
      "https://dreamlightvalleywiki.com/San_Fransokyo_Square_Archway"
    ]
  },
  {
    "name": "Retro Snack Bar",
    "sources": [
      "https://dreamlightvalleywiki.com/Retro_Snack_Bar"
    ]
  },
  {
    "name": "V8 Cafe Tiles",
    "sources": [
      "https://dreamlightvalleywiki.com/V8_Cafe_Tiles"
    ]
  },
  {
    "name": "V8 Cafe Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/V8_Cafe_Wallpaper"
    ]
  },
  {
    "name": "The V8 Cafe",
    "sources": [
      "https://dreamlightvalleywiki.com/The_V8_Cafe"
    ]
  },
  {
    "name": "Dinosaur Egg",
    "sources": [
      "https://dreamlightvalleywiki.com/Dinosaur_Egg"
    ]
  },
  {
    "name": "Adventureland Entry Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Adventureland_Entry_Arch"
    ]
  },
  {
    "name": "Adventureland Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Adventureland_Lamppost"
    ]
  },
  {
    "name": "Cinderella Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Cinderella_Popcorn_Bucket"
    ]
  },
  {
    "name": "Figment Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Figment_Popcorn_Bucket"
    ]
  },
  {
    "name": "Fuente de la Fortuna",
    "sources": [
      "https://dreamlightvalleywiki.com/Fuente_de_la_Fortuna"
    ]
  },
  {
    "name": "Haunted Armor",
    "sources": [
      "https://dreamlightvalleywiki.com/Haunted_Armor"
    ]
  },
  {
    "name": "Jungle Cruise Entrance",
    "sources": [
      "https://dreamlightvalleywiki.com/Jungle_Cruise_Entrance"
    ]
  },
  {
    "name": "Metallic Mickey Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Metallic_Mickey_Popcorn_Bucket"
    ]
  },
  {
    "name": "Pooh's Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Pooh%27s_Popcorn_Bucket"
    ]
  },
  {
    "name": "Slinky Dog Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Slinky_Dog_Popcorn_Bucket"
    ]
  },
  {
    "name": "Stitch Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Stitch_Popcorn_Bucket"
    ]
  },
  {
    "name": "Pixie Hollow Garden Gnome",
    "sources": [
      "https://dreamlightvalleywiki.com/Pixie_Hollow_Garden_Gnome"
    ]
  },
  {
    "name": "Dreamlight Gaming Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Dreamlight_Gaming_Chair"
    ]
  },
  {
    "name": "Manta Ray Mobile",
    "sources": [
      "https://dreamlightvalleywiki.com/Manta_Ray_Mobile"
    ]
  },
  {
    "name": "Gold and Marble Pillar",
    "sources": [
      "https://dreamlightvalleywiki.com/Gold_and_Marble_Pillar"
    ]
  },
  {
    "name": "Golden Olympian Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Golden_Olympian_Tree"
    ]
  },
  {
    "name": "Olympic Golden Cornucopia",
    "sources": [
      "https://dreamlightvalleywiki.com/Olympic_Golden_Cornucopia"
    ]
  },
  {
    "name": "Small Gold and Marble Pillar",
    "sources": [
      "https://dreamlightvalleywiki.com/Small_Gold_and_Marble_Pillar"
    ]
  },
  {
    "name": "Lance Slashblade Statue",
    "sources": [
      "https://dreamlightvalleywiki.com/Lance_Slashblade_Statue"
    ]
  },
  {
    "name": "Memorable Rug",
    "sources": [
      "https://dreamlightvalleywiki.com/Memorable_Rug"
    ]
  },
  {
    "name": "Clothesline",
    "sources": [
      "https://dreamlightvalleywiki.com/Clothesline"
    ]
  },
  {
    "name": "Telephone Pole",
    "sources": [
      "https://dreamlightvalleywiki.com/Telephone_Pole"
    ]
  },
  {
    "name": "Art Deco Minnie Poster",
    "sources": [
      "https://dreamlightvalleywiki.com/Art_Deco_Minnie_Poster"
    ]
  },
  {
    "name": "Mickey Mouse Pumpkin",
    "sources": [
      "https://dreamlightvalleywiki.com/Mickey_Mouse_Pumpkin"
    ]
  },
  {
    "name": "Monstrous Grand Piano",
    "sources": [
      "https://dreamlightvalleywiki.com/Monstrous_Grand_Piano"
    ]
  },
  {
    "name": "Decorative Screen Divider",
    "sources": [
      "https://dreamlightvalleywiki.com/Decorative_Screen_Divider"
    ]
  },
  {
    "name": "Imperial Crafting Station",
    "sources": [
      "https://dreamlightvalleywiki.com/Imperial_Crafting_Station"
    ]
  },
  {
    "name": "Imperial Gong",
    "sources": [
      "https://dreamlightvalleywiki.com/Imperial_Gong"
    ]
  },
  {
    "name": "Magnolia Bloom Piles",
    "sources": [
      "https://dreamlightvalleywiki.com/Magnolia_Bloom_Piles"
    ]
  },
  {
    "name": "Patterned Wood",
    "sources": [
      "https://dreamlightvalleywiki.com/Patterned_Wood"
    ]
  },
  {
    "name": "Potted Magnolia",
    "sources": [
      "https://dreamlightvalleywiki.com/Potted_Magnolia"
    ]
  },
  {
    "name": "Spring Bamboo Fountain",
    "sources": [
      "https://dreamlightvalleywiki.com/Spring_Bamboo_Fountain"
    ]
  },
  {
    "name": "De Vil Rotary Phone",
    "sources": [
      "https://dreamlightvalleywiki.com/De_Vil_Rotary_Phone"
    ]
  },
  {
    "name": "Fishing Trinkets Light Fixture",
    "sources": [
      "https://dreamlightvalleywiki.com/Fishing_Trinkets_Light_Fixture"
    ]
  },
  {
    "name": "Pirate Ship Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Ship_Chair"
    ]
  },
  {
    "name": "Pirate Ship Deck",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Ship_Deck"
    ]
  },
  {
    "name": "Pirate Ship Table",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Ship_Table"
    ]
  },
  {
    "name": "Pirate Ship Wheel",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Ship_Wheel"
    ]
  },
  {
    "name": "Pirate Throne",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Throne"
    ]
  },
  {
    "name": "Scarlet Gothic Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Scarlet_Gothic_Chair"
    ]
  },
  {
    "name": "Terror-rific Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Terror-rific_Tree"
    ]
  },
  {
    "name": "The Black Cauldron",
    "sources": [
      "https://dreamlightvalleywiki.com/The_Black_Cauldron_(2)"
    ]
  },
  {
    "name": "Coral Reef Gazebo",
    "sources": [
      "https://dreamlightvalleywiki.com/Coral_Reef_Gazebo"
    ]
  },
  {
    "name": "Natural Coral Reef Sculpture",
    "sources": [
      "https://dreamlightvalleywiki.com/Natural_Coral_Reef_Sculpture"
    ]
  },
  {
    "name": "Small Natural Coral Reef Sculpture",
    "sources": [
      "https://dreamlightvalleywiki.com/Small_Natural_Coral_Reef_Sculpture"
    ]
  },
  {
    "name": "Art Deco",
    "sources": [
      "https://dreamlightvalleywiki.com/Art_Deco"
    ]
  },
  {
    "name": "Bayou Fireflies",
    "sources": [
      "https://dreamlightvalleywiki.com/Bayou_Fireflies"
    ]
  },
  {
    "name": "Feathery Vase",
    "sources": [
      "https://dreamlightvalleywiki.com/Feathery_Vase"
    ]
  },
  {
    "name": "Golden Art Deco Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/Golden_Art_Deco_Wallpaper"
    ]
  },
  {
    "name": "Orange Water Lily",
    "sources": [
      "https://dreamlightvalleywiki.com/Orange_Water_Lily"
    ]
  },
  {
    "name": "Candy Cane Door",
    "sources": [
      "https://dreamlightvalleywiki.com/Candy_Cane_Door"
    ]
  },
  {
    "name": "Clawed Foot Tub",
    "sources": [
      "https://dreamlightvalleywiki.com/Clawed_Foot_Tub"
    ]
  },
  {
    "name": "Dapper Snowman",
    "sources": [
      "https://dreamlightvalleywiki.com/Dapper_Snowman"
    ]
  },
  {
    "name": "Halloween Town Fence",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Fence"
    ]
  },
  {
    "name": "Halloween Town Fence Corner",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Fence_Corner"
    ]
  },
  {
    "name": "Halloween Town Gravestone",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Gravestone"
    ]
  },
  {
    "name": "Halloween Town Graveyard Statue",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Graveyard_Statue"
    ]
  },
  {
    "name": "Halloween Town Mausoleum",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Mausoleum"
    ]
  },
  {
    "name": "Halloween Town Small Fence",
    "sources": [
      "https://dreamlightvalleywiki.com/Halloween_Town_Small_Fence"
    ]
  },
  {
    "name": "Oogie Boogie Dice Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Oogie_Boogie_Dice_Tree"
    ]
  },
  {
    "name": "Tall Toy Block Stack",
    "sources": [
      "https://dreamlightvalleywiki.com/Tall_Toy_Block_Stack"
    ]
  },
  {
    "name": "Toy Block Archway",
    "sources": [
      "https://dreamlightvalleywiki.com/Toy_Block_Archway"
    ]
  },
  {
    "name": "Toy Block Pillar",
    "sources": [
      "https://dreamlightvalleywiki.com/Toy_Block_Pillar"
    ]
  },
  {
    "name": "Toy Block Stack",
    "sources": [
      "https://dreamlightvalleywiki.com/Toy_Block_Stack"
    ]
  },
  {
    "name": "Woody and Buzz Ice Sculptures",
    "sources": [
      "https://dreamlightvalleywiki.com/Woody_and_Buzz_Ice_Sculptures"
    ]
  },
  {
    "name": "4*Town Neon Stage",
    "sources": [
      "https://dreamlightvalleywiki.com/4*Town_Neon_Stage"
    ]
  },
  {
    "name": "Grinning Red Panda Pillar",
    "sources": [
      "https://dreamlightvalleywiki.com/Grinning_Red_Panda_Pillar"
    ]
  },
  {
    "name": "Sycamore Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Sycamore_Tree"
    ]
  },
  {
    "name": "\"Don't Put 'Em All in One Basket\" Basket",
    "sources": [
      "https://dreamlightvalleywiki.com/%22Don%27t_Put_%27Em_All_in_One_Basket%22_Basket"
    ]
  },
  {
    "name": "Adventureland Trash Bins",
    "sources": [
      "https://dreamlightvalleywiki.com/Adventureland_Trash_Bins"
    ]
  },
  {
    "name": "Ancient Stadium Walkway",
    "sources": [
      "https://dreamlightvalleywiki.com/Ancient_Stadium_Walkway"
    ]
  },
  {
    "name": "Ancient Stadium Wall",
    "sources": [
      "https://dreamlightvalleywiki.com/Ancient_Stadium_Wall"
    ]
  },
  {
    "name": "Basic Ironwork Sign",
    "sources": [
      "https://dreamlightvalleywiki.com/Basic_Ironwork_Sign"
    ]
  },
  {
    "name": "Batty Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Batty_Tree"
    ]
  },
  {
    "name": "Beige Hanging Wicker Basket",
    "sources": [
      "https://dreamlightvalleywiki.com/Beige_Hanging_Wicker_Basket"
    ]
  },
  {
    "name": "Bewitched Garden Tools",
    "sources": [
      "https://dreamlightvalleywiki.com/Bewitched_Garden_Tools"
    ]
  },
  {
    "name": "Billboard in Lights",
    "sources": [
      "https://dreamlightvalleywiki.com/Billboard_in_Lights"
    ]
  },
  {
    "name": "Blue Egg Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Blue_Egg_Lamppost"
    ]
  },
  {
    "name": "Bonfire Pit",
    "sources": [
      "https://dreamlightvalleywiki.com/Bonfire_Pit"
    ]
  },
  {
    "name": "Bright Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Bright_Balloon_Arch"
    ]
  },
  {
    "name": "Bright Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Bright_Balloon_Bouquet"
    ]
  },
  {
    "name": "Bright Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Bright_Popcorn_Bucket"
    ]
  },
  {
    "name": "Bronze and Crystal",
    "sources": [
      "https://dreamlightvalleywiki.com/Bronze_and_Crystal"
    ]
  },
  {
    "name": "Cap Mushrooms",
    "sources": [
      "https://dreamlightvalleywiki.com/Cap_Mushrooms"
    ]
  },
  {
    "name": "Carnivorous Plant",
    "sources": [
      "https://dreamlightvalleywiki.com/Carnivorous_Plant"
    ]
  },
  {
    "name": "Chomping Chest",
    "sources": [
      "https://dreamlightvalleywiki.com/Chomping_Chest"
    ]
  },
  {
    "name": "Curved Ancient Stadium Walkway",
    "sources": [
      "https://dreamlightvalleywiki.com/Curved_Ancient_Stadium_Walkway"
    ]
  },
  {
    "name": "Dazzle Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Dazzle_Balloon_Arch"
    ]
  },
  {
    "name": "Dazzle Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Dazzle_Balloon_Bouquet"
    ]
  },
  {
    "name": "Dazzle Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Dazzle_Popcorn_Bucket"
    ]
  },
  {
    "name": "Decorative Magic Seal",
    "sources": [
      "https://dreamlightvalleywiki.com/Decorative_Magic_Seal"
    ]
  },
  {
    "name": "Decorative Picnic Basket",
    "sources": [
      "https://dreamlightvalleywiki.com/Decorative_Picnic_Basket"
    ]
  },
  {
    "name": "Decorative Tulip Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Decorative_Tulip_Bouquet"
    ]
  },
  {
    "name": "DMK 10th Anniversary Hat Stand",
    "sources": [
      "https://dreamlightvalleywiki.com/DMK_10th_Anniversary_Hat_Stand"
    ]
  },
  {
    "name": "Dug Pupcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Dug_Pupcorn_Bucket"
    ]
  },
  {
    "name": "Eerie Basement Door",
    "sources": [
      "https://dreamlightvalleywiki.com/Eerie_Basement_Door"
    ]
  },
  {
    "name": "Egg Banner",
    "sources": [
      "https://dreamlightvalleywiki.com/Egg_Banner"
    ]
  },
  {
    "name": "Egg-cellent Balloons",
    "sources": [
      "https://dreamlightvalleywiki.com/Egg-cellent_Balloons"
    ]
  },
  {
    "name": "Enchanted Frost",
    "sources": [
      "https://dreamlightvalleywiki.com/Enchanted_Frost"
    ]
  },
  {
    "name": "Enchanted Frost Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/Enchanted_Frost_Wallpaper"
    ]
  },
  {
    "name": "Fancy Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Fancy_Gift_Box"
    ]
  },
  {
    "name": "Floral Alpine Signpost",
    "sources": [
      "https://dreamlightvalleywiki.com/Floral_Alpine_Signpost"
    ]
  },
  {
    "name": "Flower Shop Front",
    "sources": [
      "https://dreamlightvalleywiki.com/Flower_Shop_Front"
    ]
  },
  {
    "name": "Friendly Jack-O'—Lantern",
    "sources": [
      "https://dreamlightvalleywiki.com/Friendly_Jack-O%27%E2%80%94Lantern"
    ]
  },
  {
    "name": "Ghost",
    "sources": []
  },
  {
    "name": "Gleam Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Gleam_Balloon_Arch"
    ]
  },
  {
    "name": "Gleam Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Gleam_Balloon_Bouquet"
    ]
  },
  {
    "name": "Gleam Celebration Banner",
    "sources": [
      "https://dreamlightvalleywiki.com/Gleam_Celebration_Banner"
    ]
  },
  {
    "name": "Gleam Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Gleam_Popcorn_Bucket"
    ]
  },
  {
    "name": "Glow Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Glow_Balloon_Arch"
    ]
  },
  {
    "name": "Glow Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Glow_Balloon_Bouquet"
    ]
  },
  {
    "name": "Glow Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Glow_Popcorn_Bucket"
    ]
  },
  {
    "name": "Green Egg Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Green_Egg_Lamppost"
    ]
  },
  {
    "name": "Green Witch's Glass Window",
    "sources": [
      "https://dreamlightvalleywiki.com/Green_Witch%27s_Glass_Window"
    ]
  },
  {
    "name": "Hanging Egg Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Hanging_Egg_Chair"
    ]
  },
  {
    "name": "Happy Jack-O'—Lantern",
    "sources": [
      "https://dreamlightvalleywiki.com/Happy_Jack-O%27%E2%80%94Lantern"
    ]
  },
  {
    "name": "Haunted Well",
    "sources": [
      "https://dreamlightvalleywiki.com/Haunted_Well"
    ]
  },
  {
    "name": "Holiday Market Bench",
    "sources": [
      "https://dreamlightvalleywiki.com/Holiday_Market_Bench"
    ]
  },
  {
    "name": "Holiday Market Stall",
    "sources": [
      "https://dreamlightvalleywiki.com/Holiday_Market_Stall"
    ]
  },
  {
    "name": "Horse Hitching Post",
    "sources": [
      "https://dreamlightvalleywiki.com/Horse_Hitching_Post"
    ]
  },
  {
    "name": "Horse Topiary",
    "sources": [
      "https://dreamlightvalleywiki.com/Horse_Topiary"
    ]
  },
  {
    "name": "Illuminate Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Illuminate_Balloon_Arch"
    ]
  },
  {
    "name": "Illuminate Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Illuminate_Balloon_Bouquet"
    ]
  },
  {
    "name": "Illuminate Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Illuminate_Popcorn_Bucket"
    ]
  },
  {
    "name": "Lake Dock",
    "sources": [
      "https://dreamlightvalleywiki.com/Lake_Dock"
    ]
  },
  {
    "name": "Lake Dock Boat Port",
    "sources": [
      "https://dreamlightvalleywiki.com/Lake_Dock_Boat_Port"
    ]
  },
  {
    "name": "Lake Dock Corner",
    "sources": [
      "https://dreamlightvalleywiki.com/Lake_Dock_Corner"
    ]
  },
  {
    "name": "Large Round Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Large_Round_Gift_Box",
      "https://dreamlightvalleywiki.com/Large_Round_Gift_Box_(2)"
    ]
  },
  {
    "name": "Large Square Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Large_Square_Gift_Box"
    ]
  },
  {
    "name": "Lava Creek",
    "sources": [
      "https://dreamlightvalleywiki.com/Lava_Creek"
    ]
  },
  {
    "name": "Lucky Clover Archway",
    "sources": [
      "https://dreamlightvalleywiki.com/Lucky_Clover_Archway"
    ]
  },
  {
    "name": "Lucky Shamrock Banner",
    "sources": [
      "https://dreamlightvalleywiki.com/Lucky_Shamrock_Banner"
    ]
  },
  {
    "name": "Mickey's Halloween Candy Bowl",
    "sources": [
      "https://dreamlightvalleywiki.com/Mickey%27s_Halloween_Candy_Bowl"
    ]
  },
  {
    "name": "Mine Cart Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Mine_Cart_Popcorn_Bucket"
    ]
  },
  {
    "name": "Minnie Mouse Neon Sign",
    "sources": [
      "https://dreamlightvalleywiki.com/Minnie_Mouse_Neon_Sign"
    ]
  },
  {
    "name": "Mischievous Jack-O'—Lantern",
    "sources": [
      "https://dreamlightvalleywiki.com/Mischievous_Jack-O%27%E2%80%94Lantern"
    ]
  },
  {
    "name": "Mossy Witch Texture",
    "sources": [
      "https://dreamlightvalleywiki.com/Mossy_Witch_Texture"
    ]
  },
  {
    "name": "Mossy Witch Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/Mossy_Witch_Wallpaper"
    ]
  },
  {
    "name": "Neon CD Demo Player",
    "sources": [
      "https://dreamlightvalleywiki.com/Neon_CD_Demo_Player"
    ]
  },
  {
    "name": "New Year's Community Lanterns",
    "sources": [
      "https://dreamlightvalleywiki.com/New_Year%27s_Community_Lanterns"
    ]
  },
  {
    "name": "North Pole Crafting Station",
    "sources": [
      "https://dreamlightvalleywiki.com/North_Pole_Crafting_Station"
    ]
  },
  {
    "name": "Observatory Window",
    "sources": [
      "https://dreamlightvalleywiki.com/Observatory_Window"
    ]
  },
  {
    "name": "Outdoor Lounge Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Outdoor_Lounge_Chair"
    ]
  },
  {
    "name": "Over Easy Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Over_Easy_Chair"
    ]
  },
  {
    "name": "Palm Print Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/Palm_Print_Wallpaper"
    ]
  },
  {
    "name": "Pastel Egg Cooking Station",
    "sources": [
      "https://dreamlightvalleywiki.com/Pastel_Egg_Cooking_Station"
    ]
  },
  {
    "name": "Pile of Gifts",
    "sources": [
      "https://dreamlightvalleywiki.com/Pile_of_Gifts"
    ]
  },
  {
    "name": "Pirate Mast",
    "sources": [
      "https://dreamlightvalleywiki.com/Pirate_Mast"
    ]
  },
  {
    "name": "Potted Spring Egg Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Potted_Spring_Egg_Tree"
    ]
  },
  {
    "name": "Pumpkin Stack",
    "sources": [
      "https://dreamlightvalleywiki.com/Pumpkin_Stack"
    ]
  },
  {
    "name": "Purple Egg Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Purple_Egg_Lamppost"
    ]
  },
  {
    "name": "Radiate Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Radiate_Balloon_Arch"
    ]
  },
  {
    "name": "Radiate Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Radiate_Balloon_Bouquet"
    ]
  },
  {
    "name": "Radiate Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Radiate_Popcorn_Bucket"
    ]
  },
  {
    "name": "Red Egg Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Red_Egg_Lamppost"
    ]
  },
  {
    "name": "Red Retro Diner Bench",
    "sources": [
      "https://dreamlightvalleywiki.com/Red_Retro_Diner_Bench"
    ]
  },
  {
    "name": "Red Retro Diner Chair",
    "sources": [
      "https://dreamlightvalleywiki.com/Red_Retro_Diner_Chair"
    ]
  },
  {
    "name": "Red Valentine Petals",
    "sources": [
      "https://dreamlightvalleywiki.com/Red_Valentine_Petals"
    ]
  },
  {
    "name": "Retro Diner Table",
    "sources": [
      "https://dreamlightvalleywiki.com/Retro_Diner_Table"
    ]
  },
  {
    "name": "Retro Drive-In Sign",
    "sources": [
      "https://dreamlightvalleywiki.com/Retro_Drive-In_Sign"
    ]
  },
  {
    "name": "Retro Roadtrip Luggage",
    "sources": [
      "https://dreamlightvalleywiki.com/Retro_Roadtrip_Luggage"
    ]
  },
  {
    "name": "Round Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Round_Gift_Box"
    ]
  },
  {
    "name": "Round Rainbow Garden",
    "sources": [
      "https://dreamlightvalleywiki.com/Round_Rainbow_Garden"
    ]
  },
  {
    "name": "Shimmer Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Shimmer_Balloon_Arch"
    ]
  },
  {
    "name": "Shimmer Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Shimmer_Balloon_Bouquet"
    ]
  },
  {
    "name": "Shimmer Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Shimmer_Popcorn_Bucket"
    ]
  },
  {
    "name": "Shine Balloon Arch",
    "sources": [
      "https://dreamlightvalleywiki.com/Shine_Balloon_Arch"
    ]
  },
  {
    "name": "Shine Balloon Bouquet",
    "sources": [
      "https://dreamlightvalleywiki.com/Shine_Balloon_Bouquet"
    ]
  },
  {
    "name": "Shine Popcorn Bucket",
    "sources": [
      "https://dreamlightvalleywiki.com/Shine_Popcorn_Bucket"
    ]
  },
  {
    "name": "Sizzling BBQ Cooking Station",
    "sources": [
      "https://dreamlightvalleywiki.com/Sizzling_BBQ_Cooking_Station"
    ]
  },
  {
    "name": "Skewed Checkered Tiles",
    "sources": [
      "https://dreamlightvalleywiki.com/Skewed_Checkered_Tiles"
    ]
  },
  {
    "name": "Spring Egg Bounty",
    "sources": [
      "https://dreamlightvalleywiki.com/Spring_Egg_Bounty"
    ]
  },
  {
    "name": "Spring Stall",
    "sources": [
      "https://dreamlightvalleywiki.com/Spring_Stall"
    ]
  },
  {
    "name": "Spring Tableware",
    "sources": [
      "https://dreamlightvalleywiki.com/Spring_Tableware"
    ]
  },
  {
    "name": "Square Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Square_Gift_Box"
    ]
  },
  {
    "name": "Stargazer's Chandelier",
    "sources": [
      "https://dreamlightvalleywiki.com/Stargazer%27s_Chandelier"
    ]
  },
  {
    "name": "Summer Crafting Station",
    "sources": [
      "https://dreamlightvalleywiki.com/Summer_Crafting_Station"
    ]
  },
  {
    "name": "Tall Round Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Tall_Round_Gift_Box"
    ]
  },
  {
    "name": "Tall Square Gift Box",
    "sources": [
      "https://dreamlightvalleywiki.com/Tall_Square_Gift_Box"
    ]
  },
  {
    "name": "Tulip Lamp",
    "sources": [
      "https://dreamlightvalleywiki.com/Tulip_Lamp"
    ]
  },
  {
    "name": "Vintage Cooler",
    "sources": [
      "https://dreamlightvalleywiki.com/Vintage_Cooler"
    ]
  },
  {
    "name": "Volcanic Rock",
    "sources": [
      "https://dreamlightvalleywiki.com/Volcanic_Rock_(2)"
    ]
  },
  {
    "name": "Wicker Companion Home",
    "sources": [
      "https://dreamlightvalleywiki.com/Wicker_Companion_Home"
    ]
  },
  {
    "name": "Wicker Lantern",
    "sources": [
      "https://dreamlightvalleywiki.com/Wicker_Lantern"
    ]
  },
  {
    "name": "Willow Tree",
    "sources": [
      "https://dreamlightvalleywiki.com/Willow_Tree"
    ]
  },
  {
    "name": "Winter Carpet",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Carpet"
    ]
  },
  {
    "name": "Winter Chocolate Fountain",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Chocolate_Fountain"
    ]
  },
  {
    "name": "Winter Crystal Chandelier",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Crystal_Chandelier"
    ]
  },
  {
    "name": "Winter Crystal Crafting Station",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Crystal_Crafting_Station"
    ]
  },
  {
    "name": "Winter Crystal Piano",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Crystal_Piano"
    ]
  },
  {
    "name": "Winter Lodge Wallpaper",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Lodge_Wallpaper"
    ]
  },
  {
    "name": "Winter Lodge Wood",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Lodge_Wood"
    ]
  },
  {
    "name": "Winter Stained Glass Window",
    "sources": [
      "https://dreamlightvalleywiki.com/Winter_Stained_Glass_Window"
    ]
  },
  {
    "name": "Witch's Bookcase",
    "sources": [
      "https://dreamlightvalleywiki.com/Witch%27s_Bookcase"
    ]
  },
  {
    "name": "Wooden Potion Cupboard",
    "sources": [
      "https://dreamlightvalleywiki.com/Wooden_Potion_Cupboard"
    ]
  },
  {
    "name": "Yellow Egg Lamppost",
    "sources": [
      "https://dreamlightvalleywiki.com/Yellow_Egg_Lamppost"
    ]
  }
];

function normalizeSource(value: string): string {
  try { return decodeURIComponent(value.split(/[?#]/)[0]); }
  catch { return value.split(/[?#]/)[0]; }
}
const sources = new Set(EVENT_FURNITURE_TARGETS.flatMap(target => target.sources.map(normalizeSource)));
const names = new Set(EVENT_FURNITURE_TARGETS.map(target => target.name));
export function isEventFurniture(item: GameItem): boolean {
  return item.sourceUrl ? sources.has(normalizeSource(item.sourceUrl)) : names.has(item.name.replaceAll('’', "'"));
}
export function correctEventFurnitureAvailability(item: GameItem): void {
  if (!isEventFurniture(item)) return;
  item.event = true;
  item.premiumShop = false;
}
