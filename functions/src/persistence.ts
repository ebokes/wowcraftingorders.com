import * as admin from "firebase-admin";
import { Character, Listing, ListingPayload } from "./types";

let COLLECTIONS_SUFFIX;
switch (process.env.APP_ENV) {
    case undefined:
    case "development": {
        COLLECTIONS_SUFFIX = "_dev";
        break;
    }
    case "test": {
        COLLECTIONS_SUFFIX = "_test";
        break;
    }
    case "production": {
        COLLECTIONS_SUFFIX = "_prod";
        break;
    }
    default: {
        throw new Error(`Unknown environment: ${process.env.APP_ENV}`);
    }
}

const LISTINGS_COLLECTION = "listings" + COLLECTIONS_SUFFIX;
export const getListings = async () => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Listing;
    });
};

export const getListing = async (listingId: string): Promise<Listing | undefined> => {
    const db = admin.firestore();
    const doc = await db.collection(LISTINGS_COLLECTION).doc(listingId).get();
    return { id: doc.id, ...doc.data() } as Listing;
}

export const deleteListing = async (listingId: string) => {
    const db = admin.firestore();
    return db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
}

export const addListing = async (listing: ListingPayload): Promise<Listing> => {
    const db = admin.firestore();
    const data = await db.collection(LISTINGS_COLLECTION).add(listing);
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as Listing;
};

export const getCharacterListings = async (characters: Character[]): Promise<Listing[]> => {
    const db = admin.firestore();
    const listings: Listing[] = [];
    for (const character of characters) {
        const matchingListings = await db.collection(LISTINGS_COLLECTION)
            .where("seller.region", "==", character.region)
            .where("seller.realm", "==", character.realm)
            .where("seller.characterName", "==", character.characterName)
            .get();
        listings.push(...matchingListings.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as Listing;
        }));
    }
    return listings;
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
