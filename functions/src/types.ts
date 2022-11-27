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
    sellerId: string; // Seller ID
    item: number; // Item ID
    commission: number;
}