import { Listing } from "../types/types";
import { getTotalValueOfCommission } from "./math";

/**
 * Sort parameters from least to greatest commission.
 * @param a The first listing.
 * @param b The first listing.
 */
export const commissionSort = (a: Listing, b: Listing) => {
    return getTotalValueOfCommission(a.commission) - getTotalValueOfCommission(b.commission);
};

/**
 * Sort commissions by submit timestamp, newest to oldest.
 * @param a The first listing.
 * @param b The first listing.
 */
export const dateSort = (a: Listing, b: Listing) => {
    return b.timestampSeconds - a.timestampSeconds;
}