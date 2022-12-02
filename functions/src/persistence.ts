import * as admin from "firebase-admin";
import { Character, Listing, ListingPayload } from "./types";

const db = admin.firestore();

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
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Listing;
    });
};

export const getListing = async (listingId: string): Promise<Listing | undefined> => {
    const doc = await db.collection(LISTINGS_COLLECTION).doc(listingId).get();
    return { id: doc.id, ...doc.data() } as Listing;
}

export const deleteListing = async (listingId: string) => {
    return db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
}

// TODO: Could be slightly cleaned up
export const addListing = async (listing: ListingPayload): Promise<Listing> => {
    const data = await db.collection(LISTINGS_COLLECTION).add({ ...listing, timestampSeconds: Date.now() / 1000 });
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as Listing;
};

export const getCharacterListings = async (characters: Character[]): Promise<Listing[]> => {
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
    const listings = await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    return listings.docs.length > 0;
};
