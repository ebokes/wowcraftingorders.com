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
