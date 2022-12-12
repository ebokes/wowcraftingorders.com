import { BuyerListing, SellerListing } from "../types/types";
import { getTotalValueOfCommission } from "./math";

/**
 * Sort parameters from least to greatest commission.
 * @param a The first listing.
 * @param b The first listing.
 */
export const commissionSort = (a: BuyerListing | SellerListing, b: BuyerListing | SellerListing) => {
    return getTotalValueOfCommission(a.commission) - getTotalValueOfCommission(b.commission);
};

/**
 * Sort commissions by submit timestamp, newest to oldest.
 * @param a The first listing.
 * @param b The first listing.
 */
export const dateSort = (a: BuyerListing | SellerListing, b: BuyerListing | SellerListing) => {
    return b.timestampSeconds - a.timestampSeconds;
}