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

export interface SellerListingPayload {
    itemId: number; // Item ID
    commission: Commission; // Fine to embed
    quality: "Rank 1" | "Rank 2" | "Rank 3" | "Rank 4" | "Rank 5";
    details?: string;
    seller: Seller; // TODO: Should probably split off into a disjoint collection
    providedReagents: ReagentStack[]; // For now, it's all or nothing, but I plan to allow partial filling in the future
}

export interface SellerListing extends SellerListingPayload {
    id: string;
    timestampSeconds: number;
}

export interface BuyerListingPayload {
    type?: "buyer" | "seller";
    itemId: number; // Item ID
    commission: Commission; // Fine to embed
    quality: "Rank 1" | "Rank 2" | "Rank 3" | "Rank 4" | "Rank 5";
    details?: string;
    seller: Seller; // TODO: Should probably split off into a disjoint collection
    providedReagents: ReagentStack[]; // For now, it's all or nothing, but I plan to allow partial filling in the future
}

export interface BuyerListing extends BuyerListingPayload {
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
