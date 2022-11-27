export interface Seller {
    id: string;
    region: string;
    realm: string;
    character: string;
    discordTag?: string;
    battleNetTag?: string;
}

export interface Listing {
    id: string;
    seller: Seller; // TODO: Should probably split off into a disjoint collection
    item: number; // Item ID
    commission: number;
}