import * as admin from "firebase-admin";
import { Character, Listing, ListingPayload } from "../types/types";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { REGIONS } from "../data/regions";
import * as functions from "firebase-functions";
import { LISTINGS_COLLECTION } from "./common";


export const getListings = async () => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Listing;
    });
};

export const getListingsFromRealm = async (region: string, realm: string): Promise<Listing[]> => {
    const db = admin.firestore();

    let realmsToQuery;
    switch (region) {
        case REGIONS.US: {
            const findQueryResult = US_CONNECTED_REALMS.find((connectedRealmList) => connectedRealmList.includes(realm));
            if (findQueryResult) {
                realmsToQuery = findQueryResult
            }
            break;
        }
        case REGIONS.EU: {
            const findQueryResult = EU_CONNECTED_REALMS.find((connectedRealmList) => connectedRealmList.includes(realm));
            if (findQueryResult) {
                realmsToQuery = findQueryResult
            }
            break;
        }
        default: {
            throw new Error(`Unknown region: ${region}`);
        }
    }

    // Not a connected realm
    if (!realmsToQuery) {
        functions.logger.debug(`Realm ${region} ${realm} is not a connected realm.`);
        realmsToQuery = [realm];
    } else {
        functions.logger.debug(`Realm ${region} ${realm} is part of connected realm group ${JSON.stringify(realmsToQuery)}`);
    }

    return (await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", region)
        .where("seller.realm", "in", realmsToQuery).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Listing;
    });
}

export const getListing = async (listingId: string): Promise<Listing | undefined> => {
    const db = admin.firestore();
    const doc = await db.collection(LISTINGS_COLLECTION).doc(listingId).get();
    return { id: doc.id, ...doc.data() } as Listing;
}

export const deleteListing = async (listingId: string) => {
    const db = admin.firestore();
    return db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
}

// TODO: Could be slightly cleaned up
export const addListing = async (listing: ListingPayload): Promise<Listing> => {
    const db = admin.firestore();
    const data = await db.collection(LISTINGS_COLLECTION).add({ ...listing, timestampSeconds: Date.now() / 1000 });
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as Listing;
};

export const updateListing = async (id: string, payload: ListingPayload): Promise<Listing> => {
    const db = admin.firestore();
    await db.collection(LISTINGS_COLLECTION).doc(id).update({
        ...payload,
        timestampSeconds: Date.now() / 1000
    });
    return { id, timestampSeconds: Date.now() / 1000, ...payload } as Listing;
}

export const getListingsForItem = async (region: string, realm: string, itemId: number): Promise<Listing[]> => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).where("seller.region", "==", region).where("seller.realm", "==", realm).where("itemId", "==", itemId).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Listing;
    });
}

/**
 * Update each of the provided listings' timestamps to the current timestamp.
 * @param listings
 */
export const updateListingTimestamps = async (listings: Listing[]) => {
    const db = admin.firestore();
    const batch = db.batch();
    listings.forEach((listing) => {
        const ref = db.collection(LISTINGS_COLLECTION).doc(listing.id);
        batch.update(ref, { timestampSeconds: Date.now() / 1000 });
    });
    await batch.commit();
}

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
