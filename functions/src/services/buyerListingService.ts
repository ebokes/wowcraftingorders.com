import { RequestHandler } from "express";
import { BuyerListingPayload } from "../types/types";
import { validateBuyerListing } from "../models/BuyerListingPayload";
import { ITEMS } from "../data/items";
import { getCharacters, ownsCharacter } from "../validation/blizzard";
import {
    addBuyerListingDto,
    deleteBuyerListingDto,
    getBuyerListingDto,
    getBuyerListingsForCharactersDto,
    getBuyerListingsForItemDto,
    getBuyerListingsFromRealmDto,
    isDuplicateBuyerListing,
    updateBuyerListingDto,
    updateBuyerListingTimestamps
} from "../dto/buyerListingsDto";
import * as functions from "firebase-functions";
import axios from "axios";

export const saveBuyerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as BuyerListingPayload;
    const validationErrors = validateBuyerListing(payload);
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
    if (await isDuplicateBuyerListing(payload)) {
        return response.sendStatus(409);
    }

    const createdItem = await addBuyerListingDto(payload);
    functions.logger.debug(`Successfully created Listing. Returning it: ${JSON.stringify(createdItem)}`);
    return response.status(201).send(createdItem);
}

export const updateBuyerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Payload is missing fields
    const payload = request.body as BuyerListingPayload;
    const validationErrors = validateBuyerListing(payload);
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

    const updatedItem = await updateBuyerListingDto(request.params.id, payload);
    functions.logger.debug(`Successfully updated Listing. Returning it: ${JSON.stringify(updatedItem)}`);
    return response.status(200).send(updatedItem);
}

export const deleteBuyerListingService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Retrieve the listing by id
    const listing = await getBuyerListingDto(request.params.id);
    if (!listing) {
        return response.sendStatus(404);
    }

    // Doesn't own character
    if (!await ownsCharacter(listing.seller.region, listing.seller.realm, listing.seller.characterName, request.headers["authorization"])) {
        return response.status(400).send([{ message: "You do not own that character." }]);
    }

    await deleteBuyerListingDto(request.params.id);
    return response.sendStatus(200);
}

export const getBuyerListingsForWowAccountService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    // Get list of characters
    const characters = await getCharacters(request.params.region, request.headers["authorization"]);

    const listings = await getBuyerListingsForCharactersDto(characters);
    functions.logger.debug("Successfully retrieved listings: " + JSON.stringify(listings));
    return response.status(200).send(listings);
}

export const getBuyerListingsForRealmService: RequestHandler = async (request, response) => {
    const listings = await getBuyerListingsFromRealmDto(request.params.region, request.params.realm);
    functions.logger.debug(`Successfully retrieved listings: ${request.params.region}/${request.params.realm}: ${JSON.stringify(listings)}`);
    return response.status(200).send(listings);
}

export const getBuyerListingsForItemService: RequestHandler = async (request, response) => {
    const listings = await getBuyerListingsForItemDto(request.params.region, request.params.realm, parseInt(request.params.id));
    functions.logger.debug(`Successfully retrieved listings for ${request.params.region}/${request.params.realm} w/ Item ID${request.params.id}: ${JSON.stringify(listings)}`);
    return response.send(listings);
}

export const updateBuyerListingTimestampsService: RequestHandler = async (request, response) => {
    request.headers["authorization"] = request.headers["authorization"] as string;

    try {
        const characters = await getCharacters(request.params.region, request.headers["authorization"]);
        const listings = await getBuyerListingsForCharactersDto(characters);
        await updateBuyerListingTimestamps(listings);
        return response.sendStatus(200);
    } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
            functions.logger.warn(`Authorization error updating timestamps: ${err.response?.data?.reason}`);
            return response.sendStatus(401);
        }
        functions.logger.error(`Unknown error updating buyer timestamps: ${err}`);
        return response.sendStatus(500);
    }
}