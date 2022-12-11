import * as admin from "firebase-admin";
import { BuyerListing, BuyerListingPayload, Character } from "../types/types";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { REGIONS } from "../data/regions";
import * as functions from "firebase-functions";
import { BUYER_LISTINGS_COLLECTION } from "./common";


export const getBuyerListingsDto = async () => {
    const db = admin.firestore();
    return (await db.collection(BUYER_LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
};

export const getBuyerListingsFromRealmDto = async (region: string, realm: string): Promise<BuyerListing[]> => {
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

    return (await db.collection(BUYER_LISTINGS_COLLECTION)
        .where("seller.region", "==", region)
        .where("seller.realm", "in", realmsToQuery).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
}

export const getBuyerListingDto = async (listingId: string): Promise<BuyerListing | undefined> => {
    const db = admin.firestore();
    const doc = await db.collection(BUYER_LISTINGS_COLLECTION).doc(listingId).get();
    return { id: doc.id, ...doc.data() } as BuyerListing;
}

export const deleteBuyerListingDto = async (listingId: string) => {
    const db = admin.firestore();
    return db.collection(BUYER_LISTINGS_COLLECTION).doc(listingId).delete();
}

// TODO: Could be slightly cleaned up
export const addBuyerListingDto = async (listing: BuyerListingPayload): Promise<BuyerListing> => {
    const db = admin.firestore();
    const data = await db.collection(BUYER_LISTINGS_COLLECTION).add({
        ...listing,
        timestampSeconds: Date.now() / 1000
    });
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as BuyerListing;
};

export const updateBuyerListingDto = async (id: string, payload: BuyerListingPayload): Promise<BuyerListing> => {
    const db = admin.firestore();
    await db.collection(BUYER_LISTINGS_COLLECTION).doc(id).update({
        ...payload,
        timestampSeconds: Date.now() / 1000
    });
    return { id, timestampSeconds: Date.now() / 1000, ...payload } as BuyerListing;
}

export const getBuyerListingsForItemDto = async (region: string, realm: string, itemId: number): Promise<BuyerListing[]> => {
    const db = admin.firestore();
    return (await db.collection(BUYER_LISTINGS_COLLECTION).where("seller.region", "==", region).where("seller.realm", "==", realm).where("itemId", "==", itemId).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
}

/**
 * Update each of the provided listings' timestamps to the current timestamp.
 * @param listings
 */
export const updateBuyerListingTimestamps = async (listings: BuyerListing[]) => {
    const db = admin.firestore();
    const batch = db.batch();

    const promises = listings.map(async (listing) => {

        // Grab the document
        const ref = db.collection(BUYER_LISTINGS_COLLECTION).doc(listing.id);

        // If timestamp is at least five minutes ago, update
        const data = (await ref.get()).data() as BuyerListing;
        if (data.timestampSeconds < (Date.now() / 1000) - 300) {
            batch.update(ref, { timestampSeconds: Date.now() / 1000 });
        }
    });

    await Promise.all(promises);
    await batch.commit();
}

export const getBuyerListingsForCharactersDto = async (characters: Character[]): Promise<BuyerListing[]> => {
    const db = admin.firestore();
    const listings: BuyerListing[] = [];
    for (const character of characters) {
        const matchingListings = await db.collection(BUYER_LISTINGS_COLLECTION)
            .where("seller.region", "==", character.region)
            .where("seller.realm", "==", character.realm)
            .where("seller.characterName", "==", character.characterName)
            .get();
        listings.push(...matchingListings.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as BuyerListing;
        }));
    }
    return listings;
}

export const isDuplicateBuyerListing = async (listing: BuyerListingPayload) => {
    const db = admin.firestore();
    const listings = await db.collection(BUYER_LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    return listings.docs.length > 0;
};
