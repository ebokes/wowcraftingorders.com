import * as admin from "firebase-admin";
import { Listing, ListingPayload } from "./types";

const LISTINGS_COLLECTION = "listings";
export const getListings = async () => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return doc.data() as Listing;
    });
};

export const addListing = async (listing: ListingPayload) => {
    const db = admin.firestore();
    await db.collection(LISTINGS_COLLECTION).add(listing);
};

export const isDuplicateListing = async (listing: ListingPayload) => {
    const db = admin.firestore();
    const listings = await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    return listings.docs.length > 0;
};
