import { RequestHandler } from "express";
import { ListingPayload } from "../types/types";
import { validateListing } from "../models/ListingPayload";
import { ITEMS } from "../data/items";
import { getCharacters, ownsCharacter } from "../validation/blizzard";
import {
    addListing,
    deleteListing,
    getCharacterListings,
    getListing,
    getListingsForItem,
    getListingsFromRealm,
    isDuplicateListing,
    updateListing,
    updateListingTimestamps
} from "../dto/sell_listings";
import * as functions from "firebase-functions";

export const saveListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as ListingPayload;
    const validationErrors = validateListing(payload);
    if (validationErrors.length) {
        return response.status(400).send(validationErrors);
    }

    // Item doesn't exist
    if (!ITEMS.find(item => item.id === payload.itemId)) {
        return response.status(400).send([{ message: "Sale of this item is not supported." }]);
    }

    // Doesn't own character; skip validation if running locally
    if (process.env.APP_ENV) {
        if (!(await ownsCharacter(payload.seller.region, payload.seller.realm, payload.seller.characterName, request.headers["authorization"]))) {
            return response.status(400).send([{ message: "You do not own that character." }]);
        }
    }

    // Already has listing
    if (await isDuplicateListing(payload)) {
        return response.sendStatus(409);
    }

    const createdItem = await addListing(payload);
    functions.logger.debug(`Successfully created Listing. Returning it: ${JSON.stringify(createdItem)}`);
    return response.status(201).send(createdItem);
}

export const updateListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as ListingPayload;
    const validationErrors = validateListing(payload);
    if (validationErrors.length) {
        return response.status(400).send(validationErrors);
    }

    // Item doesn't exist
    if (!ITEMS.find(item => item.id === payload.itemId)) {
        return response.status(400).send([{ message: "Sale of this item is not supported." }]);
    }

    // Doesn't own character; skip validation if running locally
    if (process.env.APP_ENV) {
        if (!(await ownsCharacter(payload.seller.region, payload.seller.realm, payload.seller.characterName, request.headers["authorization"]))) {
            return response.status(400).send([{ message: "You do not own that character." }]);
        }
    } else {
        functions.logger.debug("Running locally; skipping character ownership check.");
    }

    const updatedItem = await updateListing(request.params.id, payload);
    functions.logger.debug(`Successfully updated Listing. Returning it: ${JSON.stringify(updatedItem)}`);
    return response.status(200).send(updatedItem);
}

export const deleteListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Retrieve the listing by id
    const listing = await getListing(request.params.id);
    if (!listing) {
        return response.sendStatus(404);
    }

    // Doesn't own character
    if (!await ownsCharacter(listing.seller.region, listing.seller.realm, listing.seller.characterName, request.headers["authorization"])) {
        return response.status(400).send([{ message: "You do not own that character." }]);
    }

    await deleteListing(request.params.id);
    return response.sendStatus(200);
}

export const getListingsForWowAccountService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Get list of characters
    const characters = await getCharacters(request.params.region, request.headers["authorization"]);

    const listings = await getCharacterListings(characters);
    functions.logger.debug("Successfully retrieved listings: " + JSON.stringify(listings));
    return response.status(200).send(listings);
}

export const getListingsForRealmService: RequestHandler = async (request, response) => {
    const listings = await getListingsFromRealm(request.params.region, request.params.realm);
    functions.logger.debug(`Successfully retrieved listings: ${request.params.region}/${request.params.realm}: ${JSON.stringify(listings)}`);
    return response.status(200).send(listings);
}

export const getListingsForItemService: RequestHandler = async (request, response) => {
    const listings = await getListingsForItem(request.params.region, request.params.realm, parseInt(request.params.id));
    functions.logger.debug(`Successfully retrieved listings for ${request.params.region}/${request.params.realm} w/ Item ID${request.params.id}: ${JSON.stringify(listings)}`);
    return response.send(listings);
}

export const updateListingTimestampsService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Get list of all their listings
    const characters = await getCharacters(request.params.region, request.headers["authorization"]);
    const listings = await getCharacterListings(characters);

    await updateListingTimestamps(listings);
    return response.sendStatus(200);
}