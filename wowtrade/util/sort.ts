import { Listing } from "../types/types";
import { totalMoneyValue } from "../components/ListingsList";

/**
 * Sort parameters from least to greatest commission.
 * @param a The first listing.
 * @param b The first listing.
 */
export const commissionSort = (a: Listing, b: Listing) => {
    const aCommission = totalMoneyValue(a.commission.gold, a.commission.silver, a.commission.copper);
    const bCommission = totalMoneyValue(b.commission.gold, b.commission.silver, b.commission.copper);
    return aCommission - bCommission;
};

/**
 * Sort commissions by submit timestamp, newest to oldest.
 * @param a The first listing.
 * @param b The first listing.
 */
export const dateSort = (a: Listing, b: Listing) => {
    return b.timestampSeconds - a.timestampSeconds;
}