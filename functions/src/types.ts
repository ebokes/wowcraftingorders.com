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
    seller: Seller; // TODO: Should probably split off into a disjoint collection
}

export interface Listing extends ListingPayload {
    id: string;
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
    characters: Character[];
}

interface Character {
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
