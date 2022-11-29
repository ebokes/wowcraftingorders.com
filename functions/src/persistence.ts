import * as admin from "firebase-admin";
import { Listing, ListingPayload } from "./types";

const LISTINGS_COLLECTION = "listings";
export const getListings = async () => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return doc.data() as Listing;
    });
};

export const getListing = async (listingId: string): Promise<Listing | undefined> => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).doc(listingId).get()).data() as Listing;
}

export const deleteListing = async (listingId: string) => {
    const db = admin.firestore();
    return db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
}

export const addListing = async (listing: ListingPayload) => {
    const db = admin.firestore();
    await db.collection(LISTINGS_COLLECTION).add(listing);
};

export const getCharacterListings = async (characters: string[]): Promise<Listing[]> => {
    const db = admin.firestore();
    return db.collection(LISTINGS_COLLECTION)
        .where("seller.characterName", "in", characters)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => doc.data() as Listing);
        });
}

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
