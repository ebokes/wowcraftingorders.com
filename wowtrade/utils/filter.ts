import { itemFromItemId } from "../data/items";
import { BuyerListing, SellerListing } from "../types/types";

/**
 * Filter to listings that fit the given search criterion.
 * @param search The search to filter by.
 *
 * This performs a "fuzzy" search, where we apply the following process:
 * - Convert both to lowercase
 * - Trim spaces from both
 * - If the item name contains the search, return true, otherwise false
 */
export const filterBySearch = (search: string) => {
    return (listing: BuyerListing | SellerListing) => {
        const fuzzyIncludes = (s1: string, s2: string) => {
            return s1.toLowerCase().replaceAll(" ", "").includes(s2.toLowerCase().replaceAll(" ", ""));
        }
        if (search === "") return true;
        return fuzzyIncludes(itemFromItemId(listing.itemId).name, search);
    }
};

/**
 * Filter to listings that fit the given search criterion.
 * @param quality The quality to filter by.
 */
export const filterByQuality = (quality: string) => {
    return (listing: BuyerListing | SellerListing) => {
        if (quality === "All") return true;
        return listing.quality === quality;
    }
};