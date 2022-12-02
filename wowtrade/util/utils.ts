import { Listing } from "../types/types";
import { totalMoneyValue } from "../components/ListingsList";

export const commissionSort = (a: Listing, b: Listing) => {
    const aCommission = totalMoneyValue(a.commission.gold, a.commission.silver, a.commission.copper);
    const bCommission = totalMoneyValue(b.commission.gold, b.commission.silver, b.commission.copper);
    return aCommission - bCommission;
};

// Most recent come last
export const dateSort = (a: Listing, b: Listing) => {
    return b.timestampSeconds - a.timestampSeconds;
}