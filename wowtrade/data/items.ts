import { Item } from "../types/types";
import {
    ADAMANT_SCALES,
    AIRY_SOUL,
    ALEXSTRASZITE,
    ARCLIGHT_CAPACITOR,
    ARTISANS_METTLE,
    AWAKENED_AIR,
    AWAKENED_DECAY,
    AWAKENED_FIRE,
    AWAKENED_FROST,
    AWAKENED_ORDER,
    AZUREWEAVE_BOLT,
    CACOPHONOUS_THUNDERSCALE,
    CENTAURS_TROPHY_NECKLACE,
    CHILLED_RUNE,
    CHRONOCLOTH_BOLT,
    CONTOURED_FOWLFEATHER,
    COSMIC_INK,
    CRYSTALSPINE_FUR,
    DARKMOON_DECK_DANCE,
    DARKMOON_DECK_INFERNO,
    DARKMOON_DECK_RIME,
    DENSE_HIDE,
    DRACONIUM_ORE,
    EARTHEN_SOUL,
    EARTHSHINE_SCALES,
    ELEMENTAL_HARMONY,
    ELEMENTAL_POTION_OF_POWER,
    EVERBURNING_BLASTING_POWDER,
    FIERY_SOUL,
    FIRE_INFUSED_HIDE,
    FLAWLESS_PROTO_DRAGON_SCALE,
    FRAMELESS_LENS,
    FROSTBITE_SCALES,
    FROSTFIRE_ALLOY,
    FROSTY_SOUL,
    FROZEN_SPELLTHREAD,
    GLITTERING_PARCHMENT,
    GLOSSY_STONE,
    GLOWING_TITAN_ORB,
    GREASED_UP_GEARS,
    ILLIMITED_DIAMOND,
    INFURIOUS_ALLOY,
    INFURIOUS_HIDE,
    INFURIOUS_SCALES,
    KHAZGORITE_ORE,
    LARGE_STURDY_FEMUR,
    MALYGITE,
    MIRESLUSH_HIDE,
    NELTHARITE,
    NOZDORITE,
    OBSIDIAN_SEARED_ALLOY,
    OMNIUM_DRACONIS,
    PHIAL_OF_ELEMENTAL_CHAOS,
    PHIAL_OF_TEPID_VERSATILITY,
    POTION_OF_FROZEN_FOCUS,
    PRIMAL_CHAOS,
    PRIMAL_CONVERGENT,
    PRIMAL_FLUX,
    PRIMAL_MOLTEN_ALLOY,
    PRISTINE_VORQUIN_HORN,
    RAINBOW_PEARL,
    REINFORCED_MACHINE_CHASSIS,
    RESILIENT_LEATHER,
    RESONANT_CRYSTAL,
    ROCKFANG_LEATHER,
    RUNED_WRITHEBARK,
    SALAMANTHER_SCALES,
    SEREVITE_ORE,
    SHIMMERING_CLASP,
    SHOCK_SPRING_COIL,
    SILKEN_GEMDUST,
    SPARK_OF_INGENUITY,
    SPOOL_OF_WILDERTHREAD,
    STONECRUST_HIDE,
    TALLSTRIDER_SINEW,
    TEMPORAL_SPELLTHREAD,
    TUFT_OF_PRIMAL_WOOL,
    VIBRANT_SHARD,
    VIBRANT_WILDERCLOTH_BOLT,
    WINDSONG_PLUMAGE,
    WRITHEBARK,
    YSEMERALD
} from "./reagents";

export const itemFromItemId = (itemId: number): Item => {
    const item = EQUIPPABLE_ITEMS.find(i => i.id === itemId);
    if (!item) {
        throw new Error(`Lookup failure: Item with id ${itemId} not found in ITEMS`);
    }
    return item;
}

const CRAFTING_ITEMS: Item[] = [{
    id: 198226, name: "Khaz'gorite Fisherfriend", itemLevel: 356, reagents: [
        { count: 10, reagent: KHAZGORITE_ORE },
        { count: 4, reagent: GREASED_UP_GEARS },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
    ]
},
    {
        id: 191223, name: "Khaz'gorite Pickaxe", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRIMAL_FLUX },
            { count: 45, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 191224, name: "Khaz'gorite Sickle", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRIMAL_FLUX },
            { count: 40, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 194126, name: "Spring-Loaded Khaz'gorite Fabric Cutters", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 4, reagent: OBSIDIAN_SEARED_ALLOY },
            { count: 2, reagent: ARCLIGHT_CAPACITOR },
            { count: 2, reagent: SHOCK_SPRING_COIL },
        ]
    }, {
        id: 198244, name: "Khaz'gorite Delver's Helmet", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 1, reagent: FRAMELESS_LENS },
            { count: 4, reagent: OBSIDIAN_SEARED_ALLOY },
            { count: 2, reagent: ARCLIGHT_CAPACITOR },
        ]
    }, {
        id: 198263, name: "Bottomless Mireslush Ore Satchel", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 6, reagent: MIRESLUSH_HIDE },
            { count: 5, reagent: FROSTFIRE_ALLOY },
        ]
    }, {
        id: 193613, name: "Flameproof Apron", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 10, reagent: FLAWLESS_PROTO_DRAGON_SCALE },
            { count: 8, reagent: STONECRUST_HIDE },
            { count: 80, reagent: ADAMANT_SCALES },
        ]
    }, {
        id: 191231, name: "Alchemist's Brilliant Mixing Rod", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 12, reagent: RUNED_WRITHEBARK },
            { count: 30, reagent: DRACONIUM_ORE },
        ]
    }, {
        id: 193544, name: "Master's Wildercloth Alchemist's Robe", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 5, reagent: SPOOL_OF_WILDERTHREAD },
            { count: 6, reagent: VIBRANT_WILDERCLOTH_BOLT },
            { count: 10, reagent: OMNIUM_DRACONIS },
        ]
    }, {
        id: 193542, name: "Master's Wildercloth Gardening Hat", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 5, reagent: SPOOL_OF_WILDERTHREAD },
            { count: 6, reagent: VIBRANT_WILDERCLOTH_BOLT },
            { count: 4, reagent: OMNIUM_DRACONIS },
        ]
    }, {
        id: 193493, name: "Expert Alchemist's Hat", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRIMAL_FLUX },
            { count: 45, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 191888, name: "Khaz'gorite Blacksmith's Hammer", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 12, reagent: AWAKENED_AIR },
            { count: 8, reagent: FROSTBITE_SCALES },
            { count: 80, reagent: RESILIENT_LEATHER },
        ]
    }, {
        id: 193042, name: "Resonant Focus", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: RESONANT_CRYSTAL },
            { count: 2, reagent: VIBRANT_SHARD },
            { count: 2, reagent: SHIMMERING_CLASP },
        ]
    }, {
        id: 193488, name: "Lavish Floral Pack", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 15, reagent: CRYSTALSPINE_FUR },
            { count: 10, reagent: MIRESLUSH_HIDE },
            { count: 60, reagent: RESILIENT_LEATHER },
            { count: 5, reagent: OMNIUM_DRACONIS },
        ]
    }, {
        id: 198716, name: "Runed Khaz'gorite Rod", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 5, reagent: VIBRANT_SHARD },
            { count: 1, reagent: RESONANT_CRYSTAL },
            { count: 4, reagent: KHAZGORITE_ORE },
            { count: 2, reagent: RUNED_WRITHEBARK },
        ]
    }, {
        id: 191225, name: "Khaz'gorite Skinning Knife", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRIMAL_FLUX },
            { count: 40, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 191230, name: "Khaz'gorite Blacksmith's Toolbox", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 12, reagent: PRIMAL_FLUX },
            { count: 40, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 193545, name: "Master's Wildercloth Chef's Hat", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 6, reagent: SPOOL_OF_WILDERTHREAD },
            { count: 6, reagent: VIBRANT_WILDERCLOTH_BOLT },
        ]
    }, {
        id: 193492, name: "Masterwork Smock", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 15, reagent: CRYSTALSPINE_FUR },
            { count: 10, reagent: MIRESLUSH_HIDE },
            { count: 80, reagent: RESILIENT_LEATHER },
        ]
    }, {
        id: 191227, name: "Khaz'gorite Leatherworker's Knife", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRIMAL_FLUX },
            { count: 40, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 191232, name: "Chef's Splendid Rolling Pin", itemLevel: 356, reagents: [
            { count: 12, reagent: RUNED_WRITHEBARK },
            { count: 30, reagent: DRACONIUM_ORE },
        ]
    }, {
        id: 193041, name: "Alexstraszite Loupes", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: VIBRANT_SHARD },
            { count: 2, reagent: FRAMELESS_LENS },
            { count: 5, reagent: SHIMMERING_CLASP },
            { count: 2, reagent: ALEXSTRASZITE },
        ]
    }, {
        id: 191229, name: "Khaz'gorite Leatherworker's Toolset", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 12, reagent: PRIMAL_FLUX },
            { count: 40, reagent: KHAZGORITE_ORE },
            { count: 100, reagent: SEREVITE_ORE },
        ]
    }, {
        id: 193533, name: "Master's Wildercloth Enchanter's Hat", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: RESONANT_CRYSTAL },
            { count: 5, reagent: SPOOL_OF_WILDERTHREAD },
            { count: 5, reagent: VIBRANT_WILDERCLOTH_BOLT },
        ]
    }, {
        id: 198235, name: "Lapidary's Khaz'gorite Clamps", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 20, reagent: KHAZGORITE_ORE },
            { count: 2, reagent: ARCLIGHT_CAPACITOR },
            { count: 5, reagent: GREASED_UP_GEARS },
        ]
    }, {
        id: 198205, name: "Khaz'gorite Brainwave Amplifier", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: FRAMELESS_LENS },
            { count: 10, reagent: KHAZGORITE_ORE },
            { count: 2, reagent: SHOCK_SPRING_COIL },
            { count: 3, reagent: GREASED_UP_GEARS },
            { count: 4, reagent: ARCLIGHT_CAPACITOR },
        ]
    }, {
        id: 194875, name: "Scribe's Resplendent Quill", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 1, reagent: CONTOURED_FOWLFEATHER },
            { count: 12, reagent: RUNED_WRITHEBARK },
            { count: 4, reagent: COSMIC_INK },
        ]
    }, {
        id: 193543, name: "Master's Wildercloth Fishing Cap", itemLevel: 356, reagents: [
            { count: 2, reagent: RAINBOW_PEARL },
            { count: 5, reagent: SPOOL_OF_WILDERTHREAD },
            { count: 3, reagent: VIBRANT_WILDERCLOTH_BOLT },
        ]
    }, {
        id: 193616, name: "Resplendent Cover", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 20, reagent: SALAMANTHER_SCALES },
            { count: 10, reagent: STONECRUST_HIDE },
            { count: 80, reagent: RESILIENT_LEATHER },
        ]
    }, {
        id: 193490, name: "Expert Skinner's Cap", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 4, reagent: WINDSONG_PLUMAGE },
            { count: 2, reagent: TUFT_OF_PRIMAL_WOOL },
            { count: 10, reagent: EARTHSHINE_SCALES },
            { count: 80, reagent: RESILIENT_LEATHER },
        ]
    }, {
        id: 193489, name: "Reinforced Pack", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 15, reagent: PRISTINE_VORQUIN_HORN },
            { count: 10, reagent: EARTHSHINE_SCALES },
            { count: 80, reagent: RESILIENT_LEATHER },
        ]
    }, {
        id: 193039, name: "Fine-Print Trifocals", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: VIBRANT_SHARD },
            { count: 2, reagent: FRAMELESS_LENS },
            { count: 5, reagent: SHIMMERING_CLASP },
            { count: 2, reagent: NOZDORITE },
        ]
    }, {
        id: 193491, name: "Shockproof Gloves", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 15, reagent: ROCKFANG_LEATHER },
            { count: 10, reagent: EARTHSHINE_SCALES },
            { count: 80, reagent: ADAMANT_SCALES },
        ]
    }, {
        id: 193040, name: "Magnificent Margin Magnifier", itemLevel: 356, reagents: [
            { count: 225, reagent: ARTISANS_METTLE },
            { count: 2, reagent: FRAMELESS_LENS },
            { count: 2, reagent: SHIMMERING_CLASP },
            { count: 4, reagent: NOZDORITE },
        ]
    }, {
        id: 198246, name: "Khaz'gorite Encased Samophlange", itemLevel: 356, reagents: [
            { count: 300, reagent: ARTISANS_METTLE },
            { count: 10, reagent: KHAZGORITE_ORE },
            { count: 2, reagent: SHOCK_SPRING_COIL },
            { count: 3, reagent: GREASED_UP_GEARS },
            { count: 5, reagent: ARCLIGHT_CAPACITOR },
        ]
    }];


const EQUIPPABLE_ITEMS: Item[] = [{
    "id": 191492, "name": "Alacritous Alchemist Stone", "itemLevel": 350, "reagents": [
        { "count": 1, "reagent": SPARK_OF_INGENUITY },
        { "count": 60, reagent: PRIMAL_CHAOS },
        { "count": 1, reagent: GLOWING_TITAN_ORB },
        { "count": 15, reagent: OMNIUM_DRACONIS },
        { "count": 12, reagent: ELEMENTAL_POTION_OF_POWER },
        { "count": 12, reagent: POTION_OF_FROZEN_FOCUS },
    ]
}, {
    "id": 190516,
    "name": "Obsidian Seared Crusher",
    "itemLevel": 350,
    "reagents": [
        { "count": 2, "reagent": SPARK_OF_INGENUITY },
        { "count": 160, reagent: PRIMAL_CHAOS },
        { "count": 7, reagent: OBSIDIAN_SEARED_ALLOY },
        { "count": 7, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193001,
    "name": "Elemental Lariat",
    "itemLevel": 350,
    reagents: [
        { "count": 1, "reagent": SPARK_OF_INGENUITY },
        { "count": 30, reagent: PRIMAL_CHAOS }, // TODO: Can this be made with work orders?
        { count: 2, reagent: SHIMMERING_CLASP },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 1, reagent: ELEMENTAL_HARMONY }
    ]
}, {
    "id": 194894, "name": "Weathered Explorer's Stave", "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: AWAKENED_DECAY },
        { count: 12, reagent: COSMIC_INK },
        { count: 8, reagent: RUNED_WRITHEBARK },
        { count: 5, reagent: CHILLED_RUNE }
    ]
}, {
    "id": 191491,
    "name": "Sustaining Alchemist Stone",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: GLOWING_TITAN_ORB },
        { count: 4, reagent: PRIMAL_CONVERGENT },
        { count: 6, reagent: PHIAL_OF_TEPID_VERSATILITY },
        { count: 6, reagent: PHIAL_OF_ELEMENTAL_CHAOS }
    ]
}, {
    "id": 192081, "name": "Shield of the Hearth", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: EARTHEN_SOUL },
        { count: 1, reagent: GLOWING_TITAN_ORB },
        { count: 16, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193449,
    "name": "Bow of the Dragon Hunters",
    "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: AWAKENED_AIR },
        { count: 2, reagent: TALLSTRIDER_SINEW },
        { count: 10, reagent: MIRESLUSH_HIDE },
        { count: 2, reagent: RUNED_WRITHEBARK },
    ]
}, {
    "id": 194872, "name": "Darkmoon Deck Box: Inferno", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: DARKMOON_DECK_INFERNO },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 10, reagent: WRITHEBARK },
        { count: 12, reagent: COSMIC_INK },
    ]
}, {
    "id": 198326,
    "name": "Battle-Ready Binoculars",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: AWAKENED_ORDER },
        { count: 2, reagent: FRAMELESS_LENS },
        { count: 2, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
    ]
}, {
    "id": 190510, "name": "Primal Molten Greataxe", "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 20, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193494,
    "name": "Flaring Cowl",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 198478, "name": "Darkmoon Deck Box: Dance", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: DARKMOON_DECK_DANCE },
        { count: 10, reagent: AWAKENED_AIR },
        { count: 16, reagent: WRITHEBARK },
        { count: 100, reagent: COSMIC_INK },
    ]
}, {
    "id": 190507,
    "name": "Primal Molten Longsword",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 17, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190509,
    "name": "Primal Molten Mace",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 17, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193400, "name": "Life-Bound Cap", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: WINDSONG_PLUMAGE },
        { count: 15, reagent: MIRESLUSH_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 198335,
    "name": "Ol' Smoky",
    "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
        { count: 8, reagent: EVERBURNING_BLASTING_POWDER },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
    ]
}, {
    "id": 190514, "name": "Obsidian Seared Claymore", "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 5, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190511, "name": "Obsidian Seared Hexsword", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 120, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 6, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193399, "name": "Life-Bound Chestpiece", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: FLAWLESS_PROTO_DRAGON_SCALE },
        { count: 15, reagent: MIRESLUSH_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 190501,
    "name": "Primal Molten Greatbelt",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 13, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190515, "name": "Obsidian Seared Halberd", "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 8, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 198477,
    "name": "Darkmoon Deck Box: Rime",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: DARKMOON_DECK_RIME },
        { count: 10, reagent: AWAKENED_FROST },
        { count: 10, reagent: WRITHEBARK },
        { count: 12, reagent: COSMIC_INK },
    ]
}, {
    "id": 190518, "name": "Obsidian Seared Slicer", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 5, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 8, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193408, "name": "Life-Bound Trousers", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CACOPHONOUS_THUNDERSCALE },
        { count: 15, reagent: STONECRUST_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 190523,
    "name": "Frostfire Legguards of Preparation",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROSTY_SOUL },
        { count: 1, reagent: FIERY_SOUL },
        { count: 16, reagent: FROSTFIRE_ALLOY },
    ]
}, {
    "id": 190522,
    "name": "Infurious Helm of Vengeance",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 20, reagent: INFURIOUS_ALLOY },
    ]
}, {
    "id": 198324, "name": "Peripheral Vision Projectors", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: AWAKENED_ORDER },
        { count: 4, reagent: STONECRUST_HIDE },
        { count: 2, reagent: FRAMELESS_LENS },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
    ]
}, {
    "id": 193000,
    "name": "Ring-Bound Hourglass",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193455,
    "name": "Infurious Footwraps of Indemnity",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: SHIMMERING_CLASP },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 1, reagent: ELEMENTAL_HARMONY },
        { count: 3, reagent: SILKEN_GEMDUST },
    ]
}, {
    "id": 193496, "name": "Witherrot Tome", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 15, reagent: AWAKENED_DECAY },
        { count: 2, reagent: TALLSTRIDER_SINEW },
        { count: 14, reagent: STONECRUST_HIDE },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 192999,
    "name": "Signet of Titanic Insight",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: SHIMMERING_CLASP },
        { count: 1, reagent: ELEMENTAL_HARMONY },
        { count: 1, reagent: YSEMERALD },
    ]
}, {
    "id": 193422, "name": "Flame-Touched Chainmail", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: FLAWLESS_PROTO_DRAGON_SCALE },
        { count: 15, reagent: STONECRUST_HIDE },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 190508,
    "name": "Primal Molten Warglaive",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 17, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 191985, "name": "Infurious Warboots of Impunity", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: LARGE_STURDY_FEMUR },
        { count: 2, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 16, reagent: INFURIOUS_ALLOY },
    ]
}, {
    "id": 193421,
    "name": "Flame-Touched Treads",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CRYSTALSPINE_FUR },
        { count: 13, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 201759, "name": "Torc of Passed Time", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: SHIMMERING_CLASP },
        { count: 1, reagent: ELEMENTAL_HARMONY },
        { count: 1, reagent: MALYGITE },
    ]
}, {
    "id": 198325,
    "name": "Oscillating Wilderness Opticals",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: AWAKENED_ORDER },
        { count: 4, reagent: FROSTBITE_SCALES },
        { count: 2, reagent: FRAMELESS_LENS },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
    ]
}, {
    "id": 193423, "name": "Flame-Touched Helmet", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CACOPHONOUS_THUNDERSCALE },
        { count: 4, reagent: STONECRUST_HIDE },
        { count: 4, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 190495, "name": "Primal Molten Breastplate", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 16, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193451,
    "name": "Slimy Expulsion Boots",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: SALAMANTHER_SCALES },
        { count: 18, reagent: STONECRUST_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193424,
    "name": "Flame-Touched Spaulders",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: WINDSONG_PLUMAGE },
        { count: 13, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193406, "name": "Life-Bound Shoulderpads", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: FIRE_INFUSED_HIDE },
        { count: 13, reagent: STONECRUST_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193466, "name": "Acidic Hailstone Treads", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 12, reagent: ROCKFANG_LEATHER },
        { count: 18, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 191623,
    "name": "Unstable Frostfire Belt",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROSTY_SOUL },
        { count: 1, reagent: FIERY_SOUL },
        { count: 13, reagent: FROSTFIRE_ALLOY },
    ]
}, {
    "id": 193398, "name": "Life-Bound Boots", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CRYSTALSPINE_FUR },
        { count: 13, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193407,
    "name": "Life-Bound Belt",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: PRISTINE_VORQUIN_HORN },
        { count: 13, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 198481,
    "name": "Darkmoon Deck Box: Watcher",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193452, "name": "Toxic Thorn Footwraps", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: CACOPHONOUS_THUNDERSCALE },
        { count: 18, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 200642,
    "name": "Torch of Primal Awakening",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 120, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: VIBRANT_SHARD },
        { count: 3, reagent: RESONANT_CRYSTAL },
        { count: 2, reagent: RUNED_WRITHEBARK },
        { count: 2, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190503, "name": "Primal Molten Defender", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 15, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193460, "name": "Venom-Steeped Stompers", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: CACOPHONOUS_THUNDERSCALE },
        { count: 18, reagent: STONECRUST_HIDE },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193461,
    "name": "Infurious Boots of Reprieve",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: CENTAURS_TROPHY_NECKLACE },
        { count: 16, reagent: INFURIOUS_HIDE },
        { count: 100, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193520, "name": "Azureweave Mantle", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROZEN_SPELLTHREAD },
        { count: 3, reagent: AZUREWEAVE_BOLT },
    ]
}, {
    "id": 193003,
    "name": "Idol of the Lifebinder",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 1, reagent: ALEXSTRASZITE },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 10, reagent: GLOSSY_STONE },
    ]
}, {
    "id": 193516, "name": "Vibrant Wildercloth Girdle", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 10, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 198323,
    "name": "Lightweight Ocular Lenses",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: AWAKENED_ORDER },
        { count: 2, reagent: FRAMELESS_LENS },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
        { count: 2, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 194898, "name": "Illuminating Pillar of the Isles", "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: COSMIC_INK },
        { count: 10, reagent: RUNED_WRITHEBARK },
        { count: 8, reagent: CHILLED_RUNE },
    ]
}, {
    "id": 193526,
    "name": "Amice of the Blue",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROSTY_SOUL },
        { count: 1, reagent: FROZEN_SPELLTHREAD },
        { count: 3, reagent: AZUREWEAVE_BOLT },
    ]
}, {
    "id": 193006, "name": "Idol of the Earth Warder", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: EARTHEN_SOUL },
        { count: 1, reagent: NELTHARITE },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 10, reagent: GLOSSY_STONE },
    ]
}, {
    "id": 193523,
    "name": "Vibrant Wildercloth Headcover",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 12, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 190513, "name": "Obsidian Seared Facesmasher", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 6, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193463, "name": "Wind Spirit's Lasso", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: AWAKENED_AIR },
        { count: 16, reagent: MIRESLUSH_HIDE },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 198327,
    "name": "Needlessly Complex Wristguards",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 5, reagent: DENSE_HIDE },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
        { count: 3, reagent: GREASED_UP_GEARS },
        { count: 3, reagent: ARCLIGHT_CAPACITOR },
    ]
}, {
    "id": 193511, "name": "Vibrant Wildercloth Shawl", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 8, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 190500, "name": "Primal Molten Pauldrons", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 15, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193508,
    "name": "Vibrant Wildercloth Shoulderspikes",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 10, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 198333, "name": "Difficult Wrist Protectors", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 2, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
        { count: 3, reagent: GREASED_UP_GEARS },
        { count: 3, reagent: ARCLIGHT_CAPACITOR },
    ]
}, {
    "id": 193509,
    "name": "Vibrant Wildercloth Vestments",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 12, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 193462, "name": "Infurious Chainhelm Protector", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: CENTAURS_TROPHY_NECKLACE },
        { count: 20, reagent: INFURIOUS_SCALES },
        { count: 100, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 190505,
    "name": "Primal Molten Shortblade",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 80, reagent: PRIMAL_CHAOS },
        { count: 17, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190498, "name": "Primal Molten Helm", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 16, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193459,
    "name": "Ancestor's Dew Drippers",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: CRYSTALSPINE_FUR },
        { count: 18, reagent: MIRESLUSH_HIDE },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193536, "name": "Azureweave Robe", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 198332,
    "name": "Complicated Cuffs",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROZEN_SPELLTHREAD },
        { count: 4, reagent: AZUREWEAVE_BOLT },
    ]
}, {
    "id": 194897, "name": "Kinetic Pillar of the Isles", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 190502,
    "name": "Primal Molten Vambraces",
    "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: COSMIC_INK },
        { count: 10, reagent: RUNED_WRITHEBARK },
        { count: 8, reagent: CHILLED_RUNE },
    ]
}, {
    "id": 193453, "name": "Allied Heartwarming Fur Coat", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193419,
    "name": "Life-Bound Bindings",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: FIRE_INFUSED_HIDE },
        { count: 3, reagent: TUFT_OF_PRIMAL_WOOL },
        { count: 20, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 190512,
    "name": "Obsidian Seared Runeaxe",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193464, "name": "Allied Legguards of Sansok Khan", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 120, reagent: PRIMAL_CHAOS },
        { count: 6, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 6, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190517,
    "name": "Obsidian Seared Invoker",
    "itemLevel": 350, reagents: [
        { count: 2, reagent: SPARK_OF_INGENUITY },
        { count: 160, reagent: PRIMAL_CHAOS },
        { count: 7, reagent: OBSIDIAN_SEARED_ALLOY },
        { count: 5, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193425, "name": "Flame-Touched Chain", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CRYSTALSPINE_FUR },
        { count: 14, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 190519,
    "name": "Allied Chestplate of Generosity",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193454,
    "name": "Old Spirit's Wristwraps",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: CENTAURS_TROPHY_NECKLACE },
        { count: 10, reagent: OBSIDIAN_SEARED_ALLOY },
    ]
}, {
    "id": 193456, "name": "Infurious Spirit's Hood", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: FIRE_INFUSED_HIDE },
        { count: 20, reagent: INFURIOUS_HIDE },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193532, "name": "Blue Dragon Soles", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROSTY_SOUL },
        { count: 1, reagent: FROZEN_SPELLTHREAD },
        { count: 3, reagent: AZUREWEAVE_BOLT },
    ]
}, {
    "id": 193005,
    "name": "Idol of the Dreamer",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193527, "name": "Chronocloth Gloves", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: AIRY_SOUL },
        { count: 1, reagent: YSEMERALD },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 10, reagent: GLOSSY_STONE },
    ]
}, {
    "id": 193537, "name": "Chronocloth Leggings", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: TEMPORAL_SPELLTHREAD },
        { count: 4, reagent: CHRONOCLOTH_BOLT },
    ]
}, {
    "id": 193426,
    "name": "Flame-Touched Legguards",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: CACOPHONOUS_THUNDERSCALE },
        { count: 15, reagent: STONECRUST_HIDE },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 194879, "name": "Crackling Codex of the Isles", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 5, reagent: AWAKENED_AIR },
        { count: 20, reagent: GLITTERING_PARCHMENT },
        { count: 10, reagent: COSMIC_INK },
        { count: 5, reagent: RUNED_WRITHEBARK },
        { count: 5, reagent: CHILLED_RUNE },
    ]
}, {
    "id": 193458, "name": "Snowball Makers", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193521,
    "name": "Hood of Surging Time",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: CRYSTALSPINE_FUR },
        { count: 20, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193418, "name": "Life-Bound Gloves", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193513,
    "name": "Infurious Binding of Gesticulation",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: SALAMANTHER_SCALES },
        { count: 13, reagent: FROSTBITE_SCALES },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 190506, "name": "Primal Molten Spellblade", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193512,
    "name": "Chronocloth Sash",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 120, reagent: PRIMAL_CHAOS },
        { count: 17, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 190496, "name": "Primal Molten Sabatons", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193524,
    "name": "Infurious Legwraps of Possibility",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 14, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193428, "name": "Flame-Touched Cuffs", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193510,
    "name": "Vibrant Wildercloth Wristwraps",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: WINDSONG_PLUMAGE },
        { count: 10, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193465, "name": "Scale Rein Grips", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 12, reagent: SALAMANTHER_SCALES },
        { count: 18, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 198322,
    "name": "Overengineered Sleeve Extenders",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: VIBRANT_WILDERCLOTH_BOLT },
        { count: 1, reagent: REINFORCED_MACHINE_CHASSIS },
        { count: 2, reagent: GREASED_UP_GEARS },
        { count: 2, reagent: ARCLIGHT_CAPACITOR },
    ]
}, {
    "id": 193427,
    "name": "Flame-Touched Handguards",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 4, reagent: ROCKFANG_LEATHER },
        { count: 13, reagent: EARTHSHINE_SCALES },
        { count: 150, reagent: ADAMANT_SCALES },
    ]
}, {
    "id": 193525, "name": "Azureweave Slippers", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROZEN_SPELLTHREAD },
        { count: 3, reagent: AZUREWEAVE_BOLT },
    ]
}, {
    "id": 193504,
    "name": "Vibrant Wildercloth Handwraps",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 10, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 190499, "name": "Primal Molten Legplates", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FIERY_SOUL },
        { count: 10, reagent: AWAKENED_FIRE },
        { count: 16, reagent: EARTHSHINE_SCALES },
        { count: 100, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193002,
    "name": "Choker of Shielding",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 16, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193457, "name": "String of Spiritual Knick-Knacks", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: SALAMANTHER_SCALES },
        { count: 20, reagent: MIRESLUSH_HIDE },
        { count: 150, reagent: RESILIENT_LEATHER },
    ]
}, {
    "id": 193004,
    "name": "Idol of the Spell-Weaver",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 60, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: FROSTY_SOUL },
        { count: 1, reagent: MALYGITE },
        { count: 1, reagent: ILLIMITED_DIAMOND },
        { count: 10, reagent: GLOSSY_STONE },
    ]
}, {
    "id": 193530, "name": "Allied Wristguards of Time Dilation", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: CENTAURS_TROPHY_NECKLACE },
        { count: 1, reagent: TEMPORAL_SPELLTHREAD },
        { count: 2, reagent: CHRONOCLOTH_BOLT },
    ]
}, {
    "id": 190526,
    "name": "Allied Wristguard of Companionship",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 30, reagent: PRIMAL_CHAOS },
        { count: 1, reagent: CENTAURS_TROPHY_NECKLACE },
        { count: 8, reagent: OBSIDIAN_SEARED_ALLOY },
    ]
}, {
    "id": 193519, "name": "Vibrant Wildercloth Slippers", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 8, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 10, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}, {
    "id": 190497,
    "name": "Primal Molten Gauntlets",
    "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 40, reagent: PRIMAL_CHAOS },
        { count: 14, reagent: PRIMAL_MOLTEN_ALLOY },
    ]
}, {
    "id": 193518, "name": "Vibrant Wildercloth Slacks", "itemLevel": 350, reagents: [
        { count: 1, reagent: SPARK_OF_INGENUITY },
        { count: 50, reagent: PRIMAL_CHAOS },
        { count: 10, reagent: SPOOL_OF_WILDERTHREAD },
        { count: 12, reagent: VIBRANT_WILDERCLOTH_BOLT },
    ]
}];

export const ITEMS: Item[] = [
    ...EQUIPPABLE_ITEMS,
    ...CRAFTING_ITEMS
]