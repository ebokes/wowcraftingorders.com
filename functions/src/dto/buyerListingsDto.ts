import * as admin from "firebase-admin";
import { BuyerListing, BuyerListingPayload, Character } from "../types/types";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { REGIONS } from "../data/regions";
import * as functions from "firebase-functions";
import { BUYER_LISTINGS_COLLECTION } from "./common";

const db = admin.firestore();
export const getBuyerListingsDto = async () => {
    console.debug(`getBuyerListingsDto()`);
    const result = (await db.collection(BUYER_LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
    console.debug(`getBuyerListingsDto() => ${JSON.stringify(result)}`);
    return result;
};

export const getBuyerListingsFromRealmDto = async (region: string, realm: string): Promise<BuyerListing[]> => {
    console.debug(`getBuyerListingsFromRealmDto: region=${region}, realm=${realm}`);
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

    const result = (await db.collection(BUYER_LISTINGS_COLLECTION)
        .where("seller.region", "==", region)
        .where("seller.realm", "in", realmsToQuery).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
    console.debug(`getBuyerListingsFromRealmDto: result=${JSON.stringify(result)}`);
    return result;
}

export const getBuyerListingDto = async (listingId: string): Promise<BuyerListing | undefined> => {
    console.debug(`getBuyerListingDto: ${listingId}`);
    const doc = await db.collection(BUYER_LISTINGS_COLLECTION).doc(listingId).get();
    console.debug(`getBuyerListingDto: ${listingId} doc: ${JSON.stringify(doc)}`);
    return { id: doc.id, ...doc.data() } as BuyerListing;
}

export const deleteBuyerListingDto = async (listingId: string) => {
    console.debug(`Deleting buyer listing ${listingId}`);
    const result = db.collection(BUYER_LISTINGS_COLLECTION).doc(listingId).delete();
    console.debug(`Deleted buyer listing ${listingId}`);
    return result;
}

// TODO: Could be slightly cleaned up
export const addBuyerListingDto = async (listing: BuyerListingPayload): Promise<BuyerListing> => {
    console.debug(`Adding buyer listing ${JSON.stringify(listing)}`);
    const data = await db.collection(BUYER_LISTINGS_COLLECTION).add({
        ...listing,
        timestampSeconds: Date.now() / 1000
    });
    console.debug(`Added buyer listing ${JSON.stringify(data)}`);
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as BuyerListing;
};

export const updateBuyerListingDto = async (id: string, payload: BuyerListingPayload): Promise<BuyerListing> => {
    console.debug(`Updating buyer listing ${id} with payload ${JSON.stringify(payload)}`);
    await db.collection(BUYER_LISTINGS_COLLECTION).doc(id).update({
        ...payload,
        timestampSeconds: Date.now() / 1000
    });
    console.debug(`Updated buyer listing ${id} with payload ${JSON.stringify(payload)}`);
    return { id, timestampSeconds: Date.now() / 1000, ...payload } as BuyerListing;
}

export const getBuyerListingsForItemDto = async (region: string, realm: string, itemId: number): Promise<BuyerListing[]> => {
    console.debug(`Starting database query for ${region} ${realm} ${itemId}`);
    const result = (await db.collection(BUYER_LISTINGS_COLLECTION).where("seller.region", "==", region).where("seller.realm", "==", realm).where("itemId", "==", itemId).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as BuyerListing;
    });
    console.debug(`Finished database query for ${region} ${realm} ${itemId}`);
    return result;
}

/**
 * Update each of the provided listings' timestamps to the current timestamp.
 * @param listings
 */
export const updateBuyerListingTimestamps = async (listings: BuyerListing[]) => {
    console.debug(`Updating ${listings.length} buyer listing timestamps`);
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
    console.debug(`Finished updating ${listings.length} buyer listing timestamps`);
}

export const getBuyerListingsForCharactersDto = async (characters: Character[]): Promise<BuyerListing[]> => {
    console.debug(`Starting database query for ${characters.length} characters`);
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
    console.debug(`Finished database query for ${characters.length} characters`);
    return listings;
}

export const isDuplicateBuyerListing = async (listing: BuyerListingPayload) => {
    console.debug(`Checking for duplicate buyer listing for ${listing.seller.region} ${listing.seller.realm} ${listing.seller.characterName} ${listing.itemId}`);
    const listings = await db.collection(BUYER_LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    console.debug(`Found ${listings.docs.length} duplicate buyer listings for ${listing.seller.region} ${listing.seller.realm} ${listing.seller.characterName} ${listing.itemId}`);
    return listings.docs.length > 0;
};
