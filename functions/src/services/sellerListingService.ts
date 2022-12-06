import { RequestHandler } from "express";
import { SellerListingPayload } from "../types/types";
import { validateSellerListing } from "../models/SellerListingPayload";
import { ITEMS } from "../data/items";
import { getCharacters, ownsCharacter } from "../validation/blizzard";
import {
    addSellerListingDto,
    deleteSellerListingDto,
    getSellerListingDto,
    getSellerListingsForCharactersDto,
    getSellerListingsForItemDto,
    getSellerListingsFromRealmDto,
    isDuplicateSellerListing,
    updateSellerListingDto,
    updateSellerListingTimestamps
} from "../dto/sellerListingsDto";
import * as functions from "firebase-functions";

export const saveSellerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as SellerListingPayload;
    const validationErrors = validateSellerListing(payload);
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
    if (await isDuplicateSellerListing(payload)) {
        return response.sendStatus(409);
    }

    const createdItem = await addSellerListingDto(payload);
    functions.logger.debug(`Successfully created Listing. Returning it: ${JSON.stringify(createdItem)}`);
    return response.status(201).send(createdItem);
}

export const updateSellerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as SellerListingPayload;
    const validationErrors = validateSellerListing(payload);
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

    const updatedItem = await updateSellerListingDto(request.params.id, payload);
    functions.logger.debug(`Successfully updated Listing. Returning it: ${JSON.stringify(updatedItem)}`);
    return response.status(200).send(updatedItem);
}

export const deleteSellerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Retrieve the listing by id
    const listing = await getSellerListingDto(request.params.id);
    if (!listing) {
        return response.sendStatus(404);
    }

    // Doesn't own character
    if (!await ownsCharacter(listing.seller.region, listing.seller.realm, listing.seller.characterName, request.headers["authorization"])) {
        return response.status(400).send([{ message: "You do not own that character." }]);
    }

    await deleteSellerListingDto(request.params.id);
    return response.sendStatus(200);
}

export const getSellerListingsForWowAccountService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Get list of characters
    const characters = await getCharacters(request.params.region, request.headers["authorization"]);

    const listings = await getSellerListingsForCharactersDto(characters);
    functions.logger.debug("Successfully retrieved listings: " + JSON.stringify(listings));
    return response.status(200).send(listings);
}

export const getSellerListingsForRealmService: RequestHandler = async (request, response) => {
    const listings = await getSellerListingsFromRealmDto(request.params.region, request.params.realm);
    functions.logger.debug(`Successfully retrieved listings: ${request.params.region}/${request.params.realm}: ${JSON.stringify(listings)}`);
    return response.status(200).send(listings);
}

export const getSellerListingsForItemService: RequestHandler = async (request, response) => {
    const listings = await getSellerListingsForItemDto(request.params.region, request.params.realm, parseInt(request.params.id));
    functions.logger.debug(`Successfully retrieved listings for ${request.params.region}/${request.params.realm} w/ Item ID${request.params.id}: ${JSON.stringify(listings)}`);
    return response.send(listings);
}

export const updateSellerListingTimestampsService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Get list of all their listings
    const characters = await getCharacters(request.params.region, request.headers["authorization"]);
    const listings = await getSellerListingsForCharactersDto(characters);

    await updateSellerListingTimestamps(listings);
    return response.sendStatus(200);
}