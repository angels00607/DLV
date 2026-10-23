import type { GameItem } from '../domain/types';

// Explicit user-provided furniture zones, 23 October 2026.
export const WISHBLOSSOM_FURNITURE_TARGETS = [
  {
    "name": "\"Institute of Skunk\" Fashion Banner",
    "sourceUrl": "https://dreamlightvalleywiki.com/%22Institute_of_Skunk%22_Fashion_Banner"
  },
  {
    "name": "\"Pin the Tail on Maximus\" Game",
    "sourceUrl": "https://dreamlightvalleywiki.com/%22Pin_the_Tail_on_Maximus%22_Game"
  },
  {
    "name": "'60s Era TV Set",
    "sourceUrl": "https://dreamlightvalleywiki.com/%2760s_Era_TV_Set"
  },
  {
    "name": "Acorn Drums",
    "sourceUrl": "https://dreamlightvalleywiki.com/Acorn_Drums"
  },
  {
    "name": "Alpine Corner Counter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Corner_Counter"
  },
  {
    "name": "Alpine Corner Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Corner_Cupboard"
  },
  {
    "name": "Alpine Cottage Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Bed"
  },
  {
    "name": "Alpine Cottage Counter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Counter"
  },
  {
    "name": "Alpine Cottage Side Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Side_Table"
  },
  {
    "name": "Alpine Cottage Vanity",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Vanity"
  },
  {
    "name": "Alpine Cottage Wardrobe",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Wardrobe"
  },
  {
    "name": "Alpine Cottage Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cottage_Window"
  },
  {
    "name": "Alpine Cuckoo Clock",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cuckoo_Clock"
  },
  {
    "name": "Alpine Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Cupboard"
  },
  {
    "name": "Alpine Dining Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Dining_Chair"
  },
  {
    "name": "Alpine Double Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Double_Cupboard"
  },
  {
    "name": "Alpine End Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_End_Cupboard"
  },
  {
    "name": "Alpine Farmhouse Sink",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Farmhouse_Sink"
  },
  {
    "name": "Alpine Fleece Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Fleece_Rug"
  },
  {
    "name": "Alpine Floral Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Floral_Arch"
  },
  {
    "name": "Alpine Flower Cart",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Flower_Cart"
  },
  {
    "name": "Alpine Grandfather Clock",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Grandfather_Clock"
  },
  {
    "name": "Alpine Spice Rack",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Spice_Rack"
  },
  {
    "name": "Alpine Water Tower",
    "sourceUrl": "https://dreamlightvalleywiki.com/Alpine_Water_Tower"
  },
  {
    "name": "Antique British Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Antique_British_Lamppost"
  },
  {
    "name": "Artful Roots Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Artful_Roots_Arch"
  },
  {
    "name": "Basketball Net",
    "sourceUrl": "https://dreamlightvalleywiki.com/Basketball_Net"
  },
  {
    "name": "Bay Window",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bay_Window"
  },
  {
    "name": "Bicycle Coffee Bar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Bicycle_Coffee_Bar"
  },
  {
    "name": "Black and White Striped Settee",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_and_White_Striped_Settee"
  },
  {
    "name": "Black Glass Mod Coffee Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Glass_Mod_Coffee_Table"
  },
  {
    "name": "Black Leaf Sculpture",
    "sourceUrl": "https://dreamlightvalleywiki.com/Black_Leaf_Sculpture"
  },
  {
    "name": "Blooming Rock Garden",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blooming_Rock_Garden"
  },
  {
    "name": "Blue Birthday Candle Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue_Birthday_Candle_Lamppost"
  },
  {
    "name": "Blue Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue_Display_Crystal"
  },
  {
    "name": "Blue Heffalump Hot Air Balloon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Blue_Heffalump_Hot_Air_Balloon"
  },
  {
    "name": "Cast Iron Greenhouse",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cast_Iron_Greenhouse"
  },
  {
    "name": "Cast Iron Greyhound Sculpture",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cast_Iron_Greyhound_Sculpture"
  },
  {
    "name": "Checkered Fashion-Show Runway",
    "sourceUrl": "https://dreamlightvalleywiki.com/Checkered_Fashion-Show_Runway"
  },
  {
    "name": "Colorful Modernist Luggage Set",
    "sourceUrl": "https://dreamlightvalleywiki.com/Colorful_Modernist_Luggage_Set"
  },
  {
    "name": "Comfy Alpine Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Comfy_Alpine_Chair"
  },
  {
    "name": "Comfy Alpine Sofa",
    "sourceUrl": "https://dreamlightvalleywiki.com/Comfy_Alpine_Sofa"
  },
  {
    "name": "Cozy Alpine Rocking Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cozy_Alpine_Rocking_Chair"
  },
  {
    "name": "Cruella's Car",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cruella%27s_Car"
  },
  {
    "name": "Cruella's Makeup Kit",
    "sourceUrl": "https://dreamlightvalleywiki.com/Cruella%27s_Makeup_Kit"
  },
  {
    "name": "Dark Deco Mirror",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dark_Deco_Mirror"
  },
  {
    "name": "Dart Board",
    "sourceUrl": "https://dreamlightvalleywiki.com/Dart_Board"
  },
  {
    "name": "De Vil Car Track Kit — Curve",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_Curve"
  },
  {
    "name": "De Vil Car Track Kit — End",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_End"
  },
  {
    "name": "De Vil Car Track Kit — Long",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_Long"
  },
  {
    "name": "De Vil Car Track Kit — Ruts",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_Ruts"
  },
  {
    "name": "De Vil Car Track Kit — Straight",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_Straight"
  },
  {
    "name": "De Vil Car Track Kit — Turn",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Car_Track_Kit_%E2%80%94_Turn"
  },
  {
    "name": "De Vil Manor Archway",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Archway"
  },
  {
    "name": "De Vil Manor Corner",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Corner"
  },
  {
    "name": "De Vil Manor Corner Storehouse",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Corner_Storehouse"
  },
  {
    "name": "De Vil Manor Entry",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Entry"
  },
  {
    "name": "De Vil Manor Small Entry",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Small_Entry"
  },
  {
    "name": "De Vil Manor Wing",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Manor_Wing"
  },
  {
    "name": "De Vil Solarium",
    "sourceUrl": "https://dreamlightvalleywiki.com/De_Vil_Solarium"
  },
  {
    "name": "Decorative Horse Feeder",
    "sourceUrl": "https://dreamlightvalleywiki.com/Decorative_Horse_Feeder"
  },
  {
    "name": "Drafting Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Drafting_Table"
  },
  {
    "name": "Elegant Skunk House",
    "sourceUrl": "https://dreamlightvalleywiki.com/Elegant_Skunk_House"
  },
  {
    "name": "Equine Treadmill",
    "sourceUrl": "https://dreamlightvalleywiki.com/Equine_Treadmill"
  },
  {
    "name": "Equine Treadmill and Winch Tower",
    "sourceUrl": "https://dreamlightvalleywiki.com/Equine_Treadmill_and_Winch_Tower"
  },
  {
    "name": "Fairy Harp",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy_Harp"
  },
  {
    "name": "Fairy Pipe Organ",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fairy_Pipe_Organ"
  },
  {
    "name": "Farmhouse Pantry Wall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Farmhouse_Pantry_Wall"
  },
  {
    "name": "Farmhouse Water Trough",
    "sourceUrl": "https://dreamlightvalleywiki.com/Farmhouse_Water_Trough"
  },
  {
    "name": "Fashion Designer Corkboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fashion_Designer_Corkboard"
  },
  {
    "name": "Fashion Designer Whiteboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fashion_Designer_Whiteboard"
  },
  {
    "name": "Fashion Show Runway",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fashion_Show_Runway"
  },
  {
    "name": "Fashionista Design Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fashionista_Design_Table"
  },
  {
    "name": "Fitting Room Screen",
    "sourceUrl": "https://dreamlightvalleywiki.com/Fitting_Room_Screen"
  },
  {
    "name": "Flat Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flat_Straw_Bale"
  },
  {
    "name": "Floral Bench Swing",
    "sourceUrl": "https://dreamlightvalleywiki.com/Floral_Bench_Swing"
  },
  {
    "name": "Floral Fairy Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Floral_Fairy_Bench"
  },
  {
    "name": "Floral Fairy Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Floral_Fairy_Chair"
  },
  {
    "name": "Floral Fairy Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Floral_Fairy_Table"
  },
  {
    "name": "Flowery Alpine Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flowery_Alpine_Rug"
  },
  {
    "name": "Flowery Wishblossom Garden",
    "sourceUrl": "https://dreamlightvalleywiki.com/Flowery_Wishblossom_Garden"
  },
  {
    "name": "Forest Pixie Cabinet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Forest_Pixie_Cabinet"
  },
  {
    "name": "Giant Beehive",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Beehive"
  },
  {
    "name": "Giant Feather Carpet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Feather_Carpet"
  },
  {
    "name": "Giant Galosh Planter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Galosh_Planter"
  },
  {
    "name": "Giant Wishblossom",
    "sourceUrl": "https://dreamlightvalleywiki.com/Giant_Wishblossom"
  },
  {
    "name": "Gothic Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gothic_Bench"
  },
  {
    "name": "Gothic Patio Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gothic_Patio_Chair"
  },
  {
    "name": "Gothic Patio Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Gothic_Patio_Table"
  },
  {
    "name": "Green Gulch Curved Hedge",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Curved_Hedge"
  },
  {
    "name": "Green Gulch Hedge",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Hedge"
  },
  {
    "name": "Green Gulch Hedge Turn",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Hedge_Turn"
  },
  {
    "name": "Green Gulch Low Hedge",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Low_Hedge"
  },
  {
    "name": "Green Gulch Rectangle Hedge",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Rectangle_Hedge"
  },
  {
    "name": "Green Gulch Round Hedge",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Gulch_Round_Hedge"
  },
  {
    "name": "Green Heffalump Hot Air Balloon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Heffalump_Hot_Air_Balloon"
  },
  {
    "name": "Green Leaf Sculpture",
    "sourceUrl": "https://dreamlightvalleywiki.com/Green_Leaf_Sculpture"
  },
  {
    "name": "Heart-Shaped Planter",
    "sourceUrl": "https://dreamlightvalleywiki.com/Heart-Shaped_Planter"
  },
  {
    "name": "Honeycomb Picnic Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Honeycomb_Picnic_Table"
  },
  {
    "name": "Horse Plushie Friend",
    "sourceUrl": "https://dreamlightvalleywiki.com/Horse_Plushie_Friend"
  },
  {
    "name": "Horseshoe Archway",
    "sourceUrl": "https://dreamlightvalleywiki.com/Horseshoe_Archway"
  },
  {
    "name": "Horseshoe Wall Hooks",
    "sourceUrl": "https://dreamlightvalleywiki.com/Horseshoe_Wall_Hooks"
  },
  {
    "name": "Iron Dress Form",
    "sourceUrl": "https://dreamlightvalleywiki.com/Iron_Dress_Form"
  },
  {
    "name": "Kitschy Horse Lamp",
    "sourceUrl": "https://dreamlightvalleywiki.com/Kitschy_Horse_Lamp"
  },
  {
    "name": "Leafy Canoe",
    "sourceUrl": "https://dreamlightvalleywiki.com/Leafy_Canoe"
  },
  {
    "name": "Leafy Hammock Seat",
    "sourceUrl": "https://dreamlightvalleywiki.com/Leafy_Hammock_Seat"
  },
  {
    "name": "Magnifying Glass Post",
    "sourceUrl": "https://dreamlightvalleywiki.com/Magnifying_Glass_Post"
  },
  {
    "name": "Matchbox Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Matchbox_Bed"
  },
  {
    "name": "Mini Ranch Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mini_Ranch_Beam"
  },
  {
    "name": "Mod Red Settee",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mod_Red_Settee"
  },
  {
    "name": "Modernist Ceiling Light",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Ceiling_Light"
  },
  {
    "name": "Modernist Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Chair"
  },
  {
    "name": "Modernist Fish-Eye Mirror",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Fish-Eye_Mirror"
  },
  {
    "name": "Modernist Hat Stand",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Hat_Stand"
  },
  {
    "name": "Modernist Luggage Set",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Luggage_Set"
  },
  {
    "name": "Modernist Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Rug"
  },
  {
    "name": "Modernist Spiral Staircase",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Spiral_Staircase"
  },
  {
    "name": "Modernist Umbrella Stand",
    "sourceUrl": "https://dreamlightvalleywiki.com/Modernist_Umbrella_Stand"
  },
  {
    "name": "Monochrome Gate",
    "sourceUrl": "https://dreamlightvalleywiki.com/Monochrome_Gate"
  },
  {
    "name": "Mossy Spiral Pillar",
    "sourceUrl": "https://dreamlightvalleywiki.com/Mossy_Spiral_Pillar"
  },
  {
    "name": "Nestling Bed",
    "sourceUrl": "https://dreamlightvalleywiki.com/Nestling_Bed"
  },
  {
    "name": "Orange Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Display_Crystal"
  },
  {
    "name": "Orange Heffalump Hot Air Balloon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Orange_Heffalump_Hot_Air_Balloon"
  },
  {
    "name": "Outdoor Runway Lights",
    "sourceUrl": "https://dreamlightvalleywiki.com/Outdoor_Runway_Lights"
  },
  {
    "name": "Outdoor Silver Fire Pit",
    "sourceUrl": "https://dreamlightvalleywiki.com/Outdoor_Silver_Fire_Pit"
  },
  {
    "name": "Oversized Umbrella",
    "sourceUrl": "https://dreamlightvalleywiki.com/Oversized_Umbrella"
  },
  {
    "name": "Painted Alpine Dinner Table",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Alpine_Dinner_Table"
  },
  {
    "name": "Painted Farm Gate",
    "sourceUrl": "https://dreamlightvalleywiki.com/Painted_Farm_Gate"
  },
  {
    "name": "Pink Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Alpine_Lamppost"
  },
  {
    "name": "Pink Birthday Candle Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Birthday_Candle_Lamppost"
  },
  {
    "name": "Pink Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Display_Crystal"
  },
  {
    "name": "Pink Heffalump Hot Air Balloon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Heffalump_Hot_Air_Balloon"
  },
  {
    "name": "Pink Pyrite Wood Stove",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pink_Pyrite_Wood_Stove"
  },
  {
    "name": "Pixie Acres Awning",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Awning"
  },
  {
    "name": "Pixie Acres Market Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Market_Building"
  },
  {
    "name": "Pixie Acres Mossy Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Mossy_Building"
  },
  {
    "name": "Pixie Acres Shelter Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Shelter_Building"
  },
  {
    "name": "Pixie Acres Short Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Short_Building"
  },
  {
    "name": "Pixie Acres Tall Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Tall_Building"
  },
  {
    "name": "Pixie Acres Terrarium",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Terrarium"
  },
  {
    "name": "Pixie Acres Waterslide",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Acres_Waterslide"
  },
  {
    "name": "Pixie Crafting Bench",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pixie_Crafting_Bench"
  },
  {
    "name": "Pop-Art Fashionista Mural",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pop-Art_Fashionista_Mural"
  },
  {
    "name": "Pop-Art Fashionista Painting",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pop-Art_Fashionista_Painting"
  },
  {
    "name": "Pretty Flower Garlands",
    "sourceUrl": "https://dreamlightvalleywiki.com/Pretty_Flower_Garlands"
  },
  {
    "name": "Purple Alpine Flower Cupboard",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Alpine_Flower_Cupboard"
  },
  {
    "name": "Purple Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Alpine_Lamppost"
  },
  {
    "name": "Purple Birthday Candle Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Birthday_Candle_Lamppost"
  },
  {
    "name": "Purple Striped Settee",
    "sourceUrl": "https://dreamlightvalleywiki.com/Purple_Striped_Settee"
  },
  {
    "name": "Rack of Fabric Rolls",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rack_of_Fabric_Rolls"
  },
  {
    "name": "Rancher's Hat Display",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rancher%27s_Hat_Display"
  },
  {
    "name": "Rectangular Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rectangular_Straw_Bale"
  },
  {
    "name": "Red Leaf Sculpture",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Leaf_Sculpture"
  },
  {
    "name": "Red Phone Booth",
    "sourceUrl": "https://dreamlightvalleywiki.com/Red_Phone_Booth"
  },
  {
    "name": "Reinforced Ranch Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Reinforced_Ranch_Beam"
  },
  {
    "name": "Retro Telephone",
    "sourceUrl": "https://dreamlightvalleywiki.com/Retro_Telephone"
  },
  {
    "name": "Rough Cut Ranch Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rough_Cut_Ranch_Beam"
  },
  {
    "name": "Round Snowy Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_Snowy_Straw_Bale"
  },
  {
    "name": "Round Snowy Straw Bales",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_Snowy_Straw_Bales"
  },
  {
    "name": "Round Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_Straw_Bale"
  },
  {
    "name": "Round Straw Bales",
    "sourceUrl": "https://dreamlightvalleywiki.com/Round_Straw_Bales"
  },
  {
    "name": "Rustic Log Gate",
    "sourceUrl": "https://dreamlightvalleywiki.com/Rustic_Log_Gate"
  },
  {
    "name": "Scarlet Bell Tower",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scarlet_Bell_Tower"
  },
  {
    "name": "Scarlet Glamour Fountain",
    "sourceUrl": "https://dreamlightvalleywiki.com/Scarlet_Glamour_Fountain"
  },
  {
    "name": "Seven Portraits",
    "sourceUrl": "https://dreamlightvalleywiki.com/Seven_Portraits"
  },
  {
    "name": "Shear Topiary",
    "sourceUrl": "https://dreamlightvalleywiki.com/Shear_Topiary"
  },
  {
    "name": "Silver Leaf Sculpture",
    "sourceUrl": "https://dreamlightvalleywiki.com/Silver_Leaf_Sculpture"
  },
  {
    "name": "Small Blue Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Blue_Display_Crystal"
  },
  {
    "name": "Small Orange Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Orange_Display_Crystal"
  },
  {
    "name": "Small Pink Display Crystal",
    "sourceUrl": "https://dreamlightvalleywiki.com/Small_Pink_Display_Crystal"
  },
  {
    "name": "Snowy Alpine Building",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Building"
  },
  {
    "name": "Snowy Alpine Corner — Short",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Corner_%E2%80%94_Short"
  },
  {
    "name": "Snowy Alpine Corner — Tall",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Corner_%E2%80%94_Tall"
  },
  {
    "name": "Snowy Alpine Half Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Half_Arch"
  },
  {
    "name": "Snowy Alpine Half Arch with Fence",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Half_Arch_with_Fence"
  },
  {
    "name": "Snowy Alpine Tower",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Tower"
  },
  {
    "name": "Snowy Alpine Tower with Waterwheel",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Tower_with_Waterwheel"
  },
  {
    "name": "Snowy Alpine Town Arch",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Town_Arch"
  },
  {
    "name": "Snowy Alpine Welcome Gate",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Welcome_Gate"
  },
  {
    "name": "Snowy Alpine Windmill",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Alpine_Windmill"
  },
  {
    "name": "Snowy Flat Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Flat_Straw_Bale"
  },
  {
    "name": "Snowy Pink Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Pink_Alpine_Lamppost"
  },
  {
    "name": "Snowy Purple Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Purple_Alpine_Lamppost"
  },
  {
    "name": "Snowy Rectangular Straw Bale",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Rectangular_Straw_Bale"
  },
  {
    "name": "Snowy Stones",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Stones"
  },
  {
    "name": "Snowy White Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_White_Alpine_Lamppost"
  },
  {
    "name": "Snowy Yellow Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Snowy_Yellow_Alpine_Lamppost"
  },
  {
    "name": "Spotted Settee",
    "sourceUrl": "https://dreamlightvalleywiki.com/Spotted_Settee"
  },
  {
    "name": "Springy Drafting Desk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Springy_Drafting_Desk"
  },
  {
    "name": "Springy Stool",
    "sourceUrl": "https://dreamlightvalleywiki.com/Springy_Stool"
  },
  {
    "name": "Stack of Mannequins",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stack_of_Mannequins"
  },
  {
    "name": "Stack of Party Hats",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stack_of_Party_Hats"
  },
  {
    "name": "Stony Alpine Fireplace",
    "sourceUrl": "https://dreamlightvalleywiki.com/Stony_Alpine_Fireplace"
  },
  {
    "name": "Swinging Alpine Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Swinging_Alpine_Door"
  },
  {
    "name": "T-Cut Ranch Beam",
    "sourceUrl": "https://dreamlightvalleywiki.com/T-Cut_Ranch_Beam"
  },
  {
    "name": "Tack Rack",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tack_Rack"
  },
  {
    "name": "Tigger Party Lanterns",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger_Party_Lanterns"
  },
  {
    "name": "Tigger's Cozy Chair",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger%27s_Cozy_Chair"
  },
  {
    "name": "Tigger's Messy Drawers",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger%27s_Messy_Drawers"
  },
  {
    "name": "Tigger's Nest",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger%27s_Nest"
  },
  {
    "name": "Tigger's Party Streamers",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger%27s_Party_Streamers"
  },
  {
    "name": "Tigger's Tree House Door",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger%27s_Tree_House_Door"
  },
  {
    "name": "Tigger-Printed Balloon",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger-Printed_Balloon"
  },
  {
    "name": "Tigger-Printed Balloon Bouquet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger-Printed_Balloon_Bouquet"
  },
  {
    "name": "Tigger-Striped Rug",
    "sourceUrl": "https://dreamlightvalleywiki.com/Tigger-Striped_Rug"
  },
  {
    "name": "Toy Barrel",
    "sourceUrl": "https://dreamlightvalleywiki.com/Toy_Barrel"
  },
  {
    "name": "Treehouse Closet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Treehouse_Closet"
  },
  {
    "name": "Vintage Drafting Desk",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Drafting_Desk"
  },
  {
    "name": "Vintage Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Lamppost"
  },
  {
    "name": "Vintage Sewing Machine",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Sewing_Machine"
  },
  {
    "name": "Vintage Studio Light",
    "sourceUrl": "https://dreamlightvalleywiki.com/Vintage_Studio_Light"
  },
  {
    "name": "Wagon Wheel Bookshelf",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wagon_Wheel_Bookshelf"
  },
  {
    "name": "Wagon Wheel Chandelier",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wagon_Wheel_Chandelier"
  },
  {
    "name": "Walk-In Closet",
    "sourceUrl": "https://dreamlightvalleywiki.com/Walk-In_Closet"
  },
  {
    "name": "White Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/White_Alpine_Lamppost"
  },
  {
    "name": "Wishblossom Fair Trophy",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wishblossom_Fair_Trophy"
  },
  {
    "name": "Wrought Iron Flower Trellises",
    "sourceUrl": "https://dreamlightvalleywiki.com/Wrought_Iron_Flower_Trellises"
  },
  {
    "name": "Yellow Alpine Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Alpine_Lamppost"
  },
  {
    "name": "Yellow Birthday Candle Lamppost",
    "sourceUrl": "https://dreamlightvalleywiki.com/Yellow_Birthday_Candle_Lamppost"
  }
];

const names = new Set(WISHBLOSSOM_FURNITURE_TARGETS.map(item => item.name));
const sources = new Set(WISHBLOSSOM_FURNITURE_TARGETS.map(item => decodeURIComponent(item.sourceUrl)));
export function isWishblossomFurniture(item: GameItem): boolean {
  let source = item.sourceUrl ?? '';
  try { source = decodeURIComponent(source.split(/[?#]/)[0]); } catch { /* Preserve malformed sources. */ }
  return item.sourceUrl ? sources.has(source) : names.has(item.name.replaceAll('’', "'"));
}
export function correctWishblossomFurnitureZone(item: GameItem): void {
  if (isWishblossomFurniture(item)) item.meta2 = 'WISHBLOSSOM MOUNTAINS';
}
