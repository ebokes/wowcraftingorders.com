import * as admin from "firebase-admin";
import { Character, SellerListing, SellerListingPayload } from "../types/types";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { REGIONS } from "../data/regions";
import * as functions from "firebase-functions";
import { LISTINGS_COLLECTION } from "./common";


export const getSellerListingsDto = async () => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
};

export const getSellerListingsFromRealmDto = async (region: string, realm: string): Promise<SellerListing[]> => {
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
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
}

export const getSellerListingDto = async (listingId: string): Promise<SellerListing | undefined> => {
    const db = admin.firestore();
    const doc = await db.collection(LISTINGS_COLLECTION).doc(listingId).get();
    return { id: doc.id, ...doc.data() } as SellerListing;
}

export const deleteSellerListingDto = async (listingId: string) => {
    const db = admin.firestore();
    return db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
}

// TODO: Could be slightly cleaned up
export const addSellerListingDto = async (listing: SellerListingPayload): Promise<SellerListing> => {
    const db = admin.firestore();
    const data = await db.collection(LISTINGS_COLLECTION).add({ ...listing, timestampSeconds: Date.now() / 1000 });
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as SellerListing;
};

export const updateSellerListingDto = async (id: string, payload: SellerListingPayload): Promise<SellerListing> => {
    const db = admin.firestore();
    await db.collection(LISTINGS_COLLECTION).doc(id).update({
        ...payload,
        timestampSeconds: Date.now() / 1000
    });
    return { id, timestampSeconds: Date.now() / 1000, ...payload } as SellerListing;
}

export const getSellerListingsForItemDto = async (region: string, realm: string, itemId: number): Promise<SellerListing[]> => {
    const db = admin.firestore();
    return (await db.collection(LISTINGS_COLLECTION).where("seller.region", "==", region).where("seller.realm", "==", realm).where("itemId", "==", itemId).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
}

/**
 * Update each of the provided listings' timestamps to the current timestamp.
 * @param listings
 */
export const updateSellerListingTimestamps = async (listings: SellerListing[]) => {
    const db = admin.firestore();
    const batch = db.batch();
    listings.forEach((listing) => {
        const ref = db.collection(LISTINGS_COLLECTION).doc(listing.id);
        batch.update(ref, { timestampSeconds: Date.now() / 1000 });
    });
    await batch.commit();
}

export const getSellerListingsForCharactersDto = async (characters: Character[]): Promise<SellerListing[]> => {
    const db = admin.firestore();
    const listings: SellerListing[] = [];
    for (const character of characters) {
        const matchingListings = await db.collection(LISTINGS_COLLECTION)
            .where("seller.region", "==", character.region)
            .where("seller.realm", "==", character.realm)
            .where("seller.characterName", "==", character.characterName)
            .get();
        listings.push(...matchingListings.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as SellerListing;
        }));
    }
    return listings;
}

export const isDuplicateSellerListing = async (listing: SellerListingPayload) => {
    const db = admin.firestore();
    const listings = await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    return listings.docs.length > 0;
};
