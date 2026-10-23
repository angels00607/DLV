import type { GameItem } from '../domain/types';

// Explicit user-provided furniture zones, 23 October 2026.
export const STORYBOOK_FURNITURE_TARGETS = [
  {
    "name": "\"La Ratatouille\" Sign",
    "sourceUrl": "https://dreamlightvalleywiki.com/%22La_Ratatouille%22_Sign"
  },
  {
    "name": "Agrabah Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Agrabah_Chair"
  },
  {
    "name": "Anchor Moment Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Anchor_Moment_Pillar"
  },
  {
    "name": "Archery Target Hutch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Archery_Target_Hutch"
  },
  {
    "name": "Atrium Candles",
    "sourceUrl": "https://dreamlightvalleywiki.com/Atrium_Candles"
  },
  {
    "name": "Aurora's Baby Bassinet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Aurora%27s_Baby_Bassinet"
  },
  {
    "name": "Aurora's Princess Party Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Aurora%27s_Princess_Party_Banner"
  },
  {
    "name": "Autumn Mage Scarecrow",
    "sourceUrl": "https://dreamlightvalleywiki.com/Autumn_Mage_Scarecrow"
  },
  {
    "name": "Autumnal Bind Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Autumnal_Bind_Barrier"
  },
  {
    "name": "Autumnal Volleyball Net",
    "sourceUrl": "https://dreamlightvalleywiki.com/Autumnal_Volleyball_Net"
  },
  {
    "name": "Baby Pegasus House",
    "sourceUrl": "https://dreamlightvalleywiki.com/Baby_Pegasus_House"
  },
  {
    "name": "Black Gothic Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Gothic_Chair"
  },
  {
    "name": "Black Gothic Chandelier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Gothic_Chandelier"
  },
  {
    "name": "Black Gothic Desk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Gothic_Desk"
  },
  {
    "name": "Black Rose Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Rose_Stones"
  },
  {
    "name": "Bonfire Pit (2)",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bonfire_Pit_(2)"
  },
  {
    "name": "Bookish Canopy Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Canopy_Bed"
  },
  {
    "name": "Bookish Fire Pit",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Fire_Pit"
  },
  {
    "name": "Bookish Golden Pergola",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Golden_Pergola"
  },
  {
    "name": "Bookish Orange Pergola",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Orange_Pergola"
  },
  {
    "name": "Bookish Red Pergola",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Red_Pergola"
  },
  {
    "name": "Bookish Tiles",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bookish_Tiles"
  },
  {
    "name": "Brave Bear Tapestry",
    "sourceUrl": "https://dreamlightvalleywiki.com/Brave_Bear_Tapestry"
  },
  {
    "name": "Briar Rose Display Shield",
    "sourceUrl": "https://dreamlightvalleywiki.com/Briar_Rose_Display_Shield"
  },
  {
    "name": "Briar Rose Sconce",
    "sourceUrl": "https://dreamlightvalleywiki.com/Briar_Rose_Sconce"
  },
  {
    "name": "Bridge Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bridge_Lamppost"
  },
  {
    "name": "Bright Hanging Glass Orbs",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bright_Hanging_Glass_Orbs"
  },
  {
    "name": "Broad Stone Vine Decorations",
    "sourceUrl": "https://dreamlightvalleywiki.com/Broad_Stone_Vine_Decorations"
  },
  {
    "name": "Broken Cobblestones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Broken_Cobblestones"
  },
  {
    "name": "Broken Teacup",
    "sourceUrl": "https://dreamlightvalleywiki.com/Broken_Teacup"
  },
  {
    "name": "Callanish Standing Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Callanish_Standing_Stones"
  },
  {
    "name": "Change of Fate Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Change_of_Fate_Rug"
  },
  {
    "name": "Chariot Lift",
    "sourceUrl": "https://dreamlightvalleywiki.com/Chariot_Lift"
  },
  {
    "name": "Clan DunBroch Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Clan_DunBroch_Banner"
  },
  {
    "name": "Clan DunBroch Family Treasure",
    "sourceUrl": "https://dreamlightvalleywiki.com/Clan_DunBroch_Family_Treasure"
  },
  {
    "name": "Clan McDuck Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Clan_McDuck_Banner"
  },
  {
    "name": "Classroom Blackboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Classroom_Blackboard"
  },
  {
    "name": "Classroom Pens & Pencils",
    "sourceUrl": "https://dreamlightvalleywiki.com/Classroom_Pens_%26_Pencils"
  },
  {
    "name": "Corporate Ceiling Lamp",
    "sourceUrl": "https://dreamlightvalleywiki.com/Corporate_Ceiling_Lamp"
  },
  {
    "name": "Crimson Banquet Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Crimson_Banquet_Chair"
  },
  {
    "name": "Curious Doors",
    "sourceUrl": "https://dreamlightvalleywiki.com/Curious_Doors"
  },
  {
    "name": "Curling Stone Vine Decorations",
    "sourceUrl": "https://dreamlightvalleywiki.com/Curling_Stone_Vine_Decorations"
  },
  {
    "name": "Decorative Honeypots",
    "sourceUrl": "https://dreamlightvalleywiki.com/Decorative_Honeypots"
  },
  {
    "name": "Divine Marble Column",
    "sourceUrl": "https://dreamlightvalleywiki.com/Divine_Marble_Column"
  },
  {
    "name": "Dream Spinning Wheel",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dream_Spinning_Wheel"
  },
  {
    "name": "Dreamlight Bell Beacon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dreamlight_Bell_Beacon"
  },
  {
    "name": "Dump Truck Armchair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dump_Truck_Armchair"
  },
  {
    "name": "Elegant Red Banquet Table — Corner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Red_Banquet_Table_%E2%80%94_Corner"
  },
  {
    "name": "Elegant Red Banquet Table — End",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Red_Banquet_Table_%E2%80%94_End"
  },
  {
    "name": "Elegant Red Banquet Table — Middle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Red_Banquet_Table_%E2%80%94_Middle"
  },
  {
    "name": "Elegant Red Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Red_Bench"
  },
  {
    "name": "Elegant Stone Barrier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Stone_Barrier"
  },
  {
    "name": "Elegant Stone Post",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Stone_Post"
  },
  {
    "name": "Engraved Marble Wallpaper",
    "sourceUrl": "https://dreamlightvalleywiki.com/Engraved_Marble_Wallpaper"
  },
  {
    "name": "Evil Queen's Lockbox",
    "sourceUrl": "https://dreamlightvalleywiki.com/Evil_Queen%27s_Lockbox"
  },
  {
    "name": "Fairy Cake Celebration Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy_Cake_Celebration_Banner"
  },
  {
    "name": "Fairy-Tale Blue and Pink Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy-Tale_Blue_and_Pink_Banner"
  },
  {
    "name": "Fairy-Tale Checkered Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy-Tale_Checkered_Banner"
  },
  {
    "name": "Fairy-Tale Diamond Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy-Tale_Diamond_Banner"
  },
  {
    "name": "Fairytale Mirror",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairytale_Mirror"
  },
  {
    "name": "Fall Leaves Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fall_Leaves_Rug"
  },
  {
    "name": "Fauna Stained Glass Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fauna_Stained_Glass_Window"
  },
  {
    "name": "Ferns and Flowers Arrangement",
    "sourceUrl": "https://dreamlightvalleywiki.com/Ferns_and_Flowers_Arrangement"
  },
  {
    "name": "Flagstone Doormat",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flagstone_Doormat"
  },
  {
    "name": "Flora Stained Glass Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flora_Stained_Glass_Window"
  },
  {
    "name": "Floral Cottage Print",
    "sourceUrl": "https://dreamlightvalleywiki.com/Floral_Cottage_Print"
  },
  {
    "name": "Flynn's Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flynn%27s_Door"
  },
  {
    "name": "Forked Stone Vine Decorations",
    "sourceUrl": "https://dreamlightvalleywiki.com/Forked_Stone_Vine_Decorations"
  },
  {
    "name": "Fountain of Thebes",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fountain_of_Thebes"
  },
  {
    "name": "Garden Temple",
    "sourceUrl": "https://dreamlightvalleywiki.com/Garden_Temple"
  },
  {
    "name": "Giant Leaf Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Leaf_Chair"
  },
  {
    "name": "Glyph Standing Stone",
    "sourceUrl": "https://dreamlightvalleywiki.com/Glyph_Standing_Stone"
  },
  {
    "name": "Golden Frame Dancing Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Dancing_Painting"
  },
  {
    "name": "Golden Frame Fairy-Tale Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Fairy-Tale_Painting"
  },
  {
    "name": "Golden Frame Forest Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Forest_Painting"
  },
  {
    "name": "Golden Frame Landscape Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Landscape_Painting"
  },
  {
    "name": "Golden Frame Princely Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Princely_Painting"
  },
  {
    "name": "Golden Frame Princess Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Golden_Frame_Princess_Painting"
  },
  {
    "name": "Graceful Feminine Dancer Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Graceful_Feminine_Dancer_Statue"
  },
  {
    "name": "Graceful Masculine Dancer Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Graceful_Masculine_Dancer_Statue"
  },
  {
    "name": "Gray Storybook Frame",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gray_Storybook_Frame"
  },
  {
    "name": "Great Tome Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/Great_Tome_Banner"
  },
  {
    "name": "Grecian Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Grecian_Pillar"
  },
  {
    "name": "Grecian Workout Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Grecian_Workout_Bench"
  },
  {
    "name": "Greek Mosaic Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Greek_Mosaic_Rug"
  },
  {
    "name": "Green Bind Armchair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Bind_Armchair"
  },
  {
    "name": "Green Bind Couch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Bind_Couch"
  },
  {
    "name": "Green Bind L Couch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Bind_L_Couch"
  },
  {
    "name": "Green Floral Gazebo",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Floral_Gazebo"
  },
  {
    "name": "Green Novel Tennis Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Novel_Tennis_Table"
  },
  {
    "name": "Green Rustic Wooden Desk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Rustic_Wooden_Desk"
  },
  {
    "name": "Hades Kiosk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Hades_Kiosk"
  },
  {
    "name": "Halloween Town Clock",
    "sourceUrl": "https://dreamlightvalleywiki.com/Halloween_Town_Clock"
  },
  {
    "name": "Jolly Roger Flag",
    "sourceUrl": "https://dreamlightvalleywiki.com/Jolly_Roger_Flag"
  },
  {
    "name": "Lantern Tree Column",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lantern_Tree_Column"
  },
  {
    "name": "Lantern Wall Brace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lantern_Wall_Brace"
  },
  {
    "name": "Lightning Generator",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lightning_Generator"
  },
  {
    "name": "Lilo's Bunk Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Lilo%27s_Bunk_Bed"
  },
  {
    "name": "Literary Lounge Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Literary_Lounge_Chair"
  },
  {
    "name": "Madrigal Family Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Madrigal_Family_Door"
  },
  {
    "name": "Medieval Wooden Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Medieval_Wooden_Chair"
  },
  {
    "name": "Merida's Fireplace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Merida%27s_Fireplace"
  },
  {
    "name": "Merryweather Stained Glass Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Merryweather_Stained_Glass_Window"
  },
  {
    "name": "Mirage Office Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mirage_Office_Chair"
  },
  {
    "name": "Mossy Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mossy_Stones"
  },
  {
    "name": "Mythic Brick Wallpaper",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mythic_Brick_Wallpaper"
  },
  {
    "name": "Mythic Marble Wallpaper",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mythic_Marble_Wallpaper"
  },
  {
    "name": "Mythical Cloud Throne",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mythical_Cloud_Throne"
  },
  {
    "name": "Orange Bind Armchair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Bind_Armchair"
  },
  {
    "name": "Orange Bind Couch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Bind_Couch"
  },
  {
    "name": "Orange Bind L Couch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Bind_L_Couch"
  },
  {
    "name": "Orange Floral Book Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Floral_Book_Arch"
  },
  {
    "name": "Painted Cottage Chest — Large",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_Chest_%E2%80%94_Large"
  },
  {
    "name": "Painted Cottage Chest — Medium",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_Chest_%E2%80%94_Medium"
  },
  {
    "name": "Painted Cottage Chest — Small",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_Chest_%E2%80%94_Small"
  },
  {
    "name": "Painted Cottage Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_Door"
  },
  {
    "name": "Painted Cottage — Downstairs",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_%E2%80%94_Downstairs"
  },
  {
    "name": "Painted Cottage — Upstairs",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Cottage_%E2%80%94_Upstairs"
  },
  {
    "name": "Pastel Stained Glass Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pastel_Stained_Glass_Window"
  },
  {
    "name": "Perched Raven Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Perched_Raven_Statue"
  },
  {
    "name": "Potted Blooming Tree",
    "sourceUrl": "https://dreamlightvalleywiki.com/Potted_Blooming_Tree"
  },
  {
    "name": "Red Floral Book Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Floral_Book_Arch"
  },
  {
    "name": "Red Novel Tennis Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Novel_Tennis_Table"
  },
  {
    "name": "Red Rose Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Rose_Stones"
  },
  {
    "name": "Regal Garden Fountain",
    "sourceUrl": "https://dreamlightvalleywiki.com/Regal_Garden_Fountain"
  },
  {
    "name": "Regal Golden Torch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Regal_Golden_Torch"
  },
  {
    "name": "Royal Candy Doors",
    "sourceUrl": "https://dreamlightvalleywiki.com/Royal_Candy_Doors"
  },
  {
    "name": "Rustic Brick Oven",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Brick_Oven"
  },
  {
    "name": "Rustic Cottage Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_Beam"
  },
  {
    "name": "Rustic Cottage Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_Bed"
  },
  {
    "name": "Rustic Cottage I-Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_I-Beam"
  },
  {
    "name": "Rustic Cottage Rafter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_Rafter"
  },
  {
    "name": "Rustic Cottage Stone Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_Stone_Bed"
  },
  {
    "name": "Rustic Cottage T-Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cottage_T-Beam"
  },
  {
    "name": "Rustic Cutlery Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Cutlery_Cupboard"
  },
  {
    "name": "Rustic Dinnerware Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Dinnerware_Cupboard"
  },
  {
    "name": "Rustic Shuttered Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Shuttered_Window"
  },
  {
    "name": "Rustic Wooden Desk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Wooden_Desk"
  },
  {
    "name": "Rustic Wool Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Wool_Rug"
  },
  {
    "name": "Sea Palace Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sea_Palace_Window"
  },
  {
    "name": "Seated Lion Statue",
    "sourceUrl": "https://dreamlightvalleywiki.com/Seated_Lion_Statue"
  },
  {
    "name": "Silled Stained Glass Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Silled_Stained_Glass_Window"
  },
  {
    "name": "Sleeping Beauty Regal Throne",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sleeping_Beauty_Regal_Throne"
  },
  {
    "name": "Snuggly Duckling Counter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snuggly_Duckling_Counter"
  },
  {
    "name": "Standing Cello",
    "sourceUrl": "https://dreamlightvalleywiki.com/Standing_Cello"
  },
  {
    "name": "Stone Lantern Tree Column",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Lantern_Tree_Column"
  },
  {
    "name": "Stone Mortar and Pestle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Mortar_and_Pestle"
  },
  {
    "name": "Stone Tree Column",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Tree_Column"
  },
  {
    "name": "Stone Tree Fireplace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Tree_Fireplace"
  },
  {
    "name": "Stone Tree Lantern Wall Brace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Tree_Lantern_Wall_Brace"
  },
  {
    "name": "Stone Tree Wall Brace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Tree_Wall_Brace"
  },
  {
    "name": "Stone Vine Decorations",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Vine_Decorations"
  },
  {
    "name": "Stone Vine Decorations (2)",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stone_Vine_Decorations_(2)"
  },
  {
    "name": "Storybook Frame",
    "sourceUrl": "https://dreamlightvalleywiki.com/Storybook_Frame"
  },
  {
    "name": "Straw and Wood Dragon Dummy",
    "sourceUrl": "https://dreamlightvalleywiki.com/Straw_and_Wood_Dragon_Dummy"
  },
  {
    "name": "Striped Gift Box",
    "sourceUrl": "https://dreamlightvalleywiki.com/Striped_Gift_Box"
  },
  {
    "name": "Sweet Blue Chandelier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Sweet_Blue_Chandelier"
  },
  {
    "name": "Swirly Striped Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Swirly_Striped_Rug"
  },
  {
    "name": "The Bind Fountain",
    "sourceUrl": "https://dreamlightvalleywiki.com/The_Bind_Fountain"
  },
  {
    "name": "The Princess and the Frog Chest — Small",
    "sourceUrl": "https://dreamlightvalleywiki.com/The_Princess_and_the_Frog_Chest_%E2%80%94_Small"
  },
  {
    "name": "The Stained Glass Window to Imagination",
    "sourceUrl": "https://dreamlightvalleywiki.com/The_Stained_Glass_Window_to_Imagination"
  },
  {
    "name": "Toadstool Fairy Circle",
    "sourceUrl": "https://dreamlightvalleywiki.com/Toadstool_Fairy_Circle"
  },
  {
    "name": "Transparent Blooming Teapot",
    "sourceUrl": "https://dreamlightvalleywiki.com/Transparent_Blooming_Teapot"
  },
  {
    "name": "Transportation Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Transportation_Table"
  },
  {
    "name": "Underworld Throne",
    "sourceUrl": "https://dreamlightvalleywiki.com/Underworld_Throne"
  },
  {
    "name": "Underworld Torch Stand",
    "sourceUrl": "https://dreamlightvalleywiki.com/Underworld_Torch_Stand"
  },
  {
    "name": "Villainous Weapons Display",
    "sourceUrl": "https://dreamlightvalleywiki.com/Villainous_Weapons_Display"
  },
  {
    "name": "Vintage Green Wallpaper",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Green_Wallpaper"
  },
  {
    "name": "White Rose Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/White_Rose_Stones"
  },
  {
    "name": "Wooden Storybook Frame",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wooden_Storybook_Frame"
  },
  {
    "name": "Wooden Wash Tub",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wooden_Wash_Tub"
  },
  {
    "name": "Yellow Cooking Crock",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Cooking_Crock"
  },
  {
    "name": "Yellow Floral Book Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Floral_Book_Arch"
  }
];

const names = new Set(STORYBOOK_FURNITURE_TARGETS.map(item => item.name));
const sources = new Set(STORYBOOK_FURNITURE_TARGETS.map(item => decodeURIComponent(item.sourceUrl)));
export function isStorybookFurniture(item: GameItem): boolean {
  let source = item.sourceUrl ?? '';
  try { source = decodeURIComponent(source.split(/[?#]/)[0]); } catch { /* Preserve malformed sources for name matching. */ }
  return item.sourceUrl ? sources.has(source) : names.has(item.name.replaceAll('’', "'"));
}
export function correctStorybookFurnitureZone(item: GameItem): void {
  if (isStorybookFurniture(item)) item.meta2 = 'STORYBOOK VALE';
}
