import * as admin from "firebase-admin";
import { Character, SellerListing, SellerListingPayload } from "../types/types";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { REGIONS } from "../data/regions";
import * as functions from "firebase-functions";
import { LISTINGS_COLLECTION } from "./common";

const db = admin.firestore();
export const getSellerListingsDto = async () => {
    console.debug(`getSellerListingsDto()`);
    const result = (await db.collection(LISTINGS_COLLECTION).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
    console.debug(`getSellerListingsDto() => ${JSON.stringify(result)}`);
    return result;
};

export const getSellerListingsFromRealmDto = async (region: string, realm: string): Promise<SellerListing[]> => {
    console.debug(`getSellerListingsFromRealmDto: region=${region}, realm=${realm}`);
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

    const result = (await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", region)
        .where("seller.realm", "in", realmsToQuery).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
    console.debug(`getSellerListingsFromRealmDto: result=${JSON.stringify(result)}`);
    return result;
}

export const getSellerListingDto = async (listingId: string): Promise<SellerListing | undefined> => {
    console.debug(`getSellerListingDto: listingId=${listingId}`);
    const doc = await db.collection(LISTINGS_COLLECTION).doc(listingId).get();
    console.debug(`getSellerListingDto: doc=${JSON.stringify(doc)}`);
    return { id: doc.id, ...doc.data() } as SellerListing;
}

export const deleteSellerListingDto = async (listingId: string) => {
    console.debug(`deleteSellerListingDto: listingId=${listingId}`);
    const result = db.collection(LISTINGS_COLLECTION).doc(listingId).delete();
    console.debug(`deleteSellerListingDto: result=${JSON.stringify(result)}`);
    return result;
}

// TODO: Could be slightly cleaned up
export const addSellerListingDto = async (listing: SellerListingPayload): Promise<SellerListing> => {
    console.debug(`addSellerListingDto: listing=${JSON.stringify(listing)}`);
    const data = await db.collection(LISTINGS_COLLECTION).add({ ...listing, timestampSeconds: Date.now() / 1000 });
    console.debug(`addSellerListingDto: data=${JSON.stringify(data)}`);
    return { id: data.id, timestampSeconds: Date.now() / 1000, ...listing } as SellerListing;
};

export const updateSellerListingDto = async (id: string, payload: SellerListingPayload): Promise<SellerListing> => {
    console.debug(`updateSellerListingDto: id=${id}, payload=${JSON.stringify(payload)}`);
    await db.collection(LISTINGS_COLLECTION).doc(id).update({
        ...payload,
        timestampSeconds: Date.now() / 1000
    });
    console.debug(`updateSellerListingDto: updated`);
    return { id, timestampSeconds: Date.now() / 1000, ...payload } as SellerListing;
}

export const getSellerListingsForItemDto = async (region: string, realm: string, itemId: number): Promise<SellerListing[]> => {
    console.debug(`getSellerListingsForItemDto: region=${region}, realm=${realm}, itemId=${itemId}`);
    const result = (await db.collection(LISTINGS_COLLECTION).where("seller.region", "==", region).where("seller.realm", "==", realm).where("itemId", "==", itemId).get()).docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SellerListing;
    });
    console.debug(`getSellerListingsForItemDto: result=${JSON.stringify(result)}`);
    return result;
}

/**
 * Update each of the provided listings' timestamps to the current timestamp.
 * @param listings
 */
export const updateSellerListingTimestamps = async (listings: SellerListing[]) => {
    console.debug(`updateSellerListingTimestamps: listings=${JSON.stringify(listings)}`);
    const batch = db.batch();
    const promises = listings.map(async (listing) => {
        const ref = db.collection(LISTINGS_COLLECTION).doc(listing.id);

        // If timestamp is at least five minutes ago, update
        const data = (await ref.get()).data() as SellerListing;
        if (data.timestampSeconds < (Date.now() / 1000) - 300) {
            batch.update(ref, { timestampSeconds: Date.now() / 1000 });
        }
    });

    await Promise.all(promises);
    await batch.commit();
    console.debug(`updateSellerListingTimestamps: done`);
}

export const getSellerListingsForCharactersDto = async (characters: Character[]): Promise<SellerListing[]> => {
    console.debug(`getSellerListingsForCharactersDto: characters=${JSON.stringify(characters)}`);
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
    console.debug(`getSellerListingsForCharactersDto: listings=${JSON.stringify(listings)}`);
    return listings;
}

export const isDuplicateSellerListing = async (listing: SellerListingPayload) => {
    console.debug(`isDuplicateSellerListing: listing=${JSON.stringify(listing)}`);
    const listings = await db.collection(LISTINGS_COLLECTION)
        .where("seller.region", "==", listing.seller.region)
        .where("seller.realm", "==", listing.seller.realm)
        .where("seller.characterName", "==", listing.seller.characterName)
        .where("itemId", "==", listing.itemId)
        .get();
    console.debug(`isDuplicateSellerListing: listings=${JSON.stringify(listings)}`);
    return listings.docs.length > 0;
};
