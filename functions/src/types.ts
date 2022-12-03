export interface Seller {
    region: string;
    realm: string;
    characterName: string;
    discordTag?: string;
    battleNetTag?: string;
}

export interface Commission {
    gold?: number;
    silver?: number;
    copper?: number;
}

export interface ListingPayload {
    itemId: number; // Item ID
    commission: Commission; // Fine to embed
    quality: "Rank 1" | "Rank 2" | "Rank 3" | "Rank 4" | "Rank 5";
    seller: Seller; // TODO: Should probably split off into a disjoint collection
}

export interface Listing extends ListingPayload {
    id: string;
    timestampSeconds: number;
}

export interface Character {
    region: string;
    realm: string;
    characterName: string;
}

export interface Item {
    id: number; // Wowhead ID
    name: string;
    itemLevel: number;
    reagents: ReagentStack[];
}

export interface ReagentStack {
    count: number;
    reagent: Reagent;
}

export interface Reagent {
    itemId: number; // Used to look up Wowhead tooltips
    required?: boolean; // If set to true, required. Otherwise, or if missing, optional.
    buyerProvides?: boolean; // If set to true, only buyer can provide. If false or missing, crafter can also provide.
}

export interface BattleNetProfileDataResponse {
    _links: {
        self: {
            href: string;
        }
        user: {
            href: string;
        }
        profile: {
            href: string;
        }
    },
    id: number,
    wow_accounts: Account[];
    collections: {
        href: string;
    }
}

interface Account {
    id: number;
    characters: BNetCharacter[];
}

export interface BNetCharacter {
    character: {
        href: string;
    };
    protected_character: {
        href: string;
    }
    name: string;
    id: number;
    realm: {
        key: {
            href: string;
        }
        name: string;
        id: number;
        slug: string;
    }
    playable_class: {
        key: {
            href: string;
        }
        name: string;
        id: number;
    }
    gender: {
        type: string;
        name: string;
    }
    faction: {
        type: string;
        name: string;
    }
    level: number;
}
