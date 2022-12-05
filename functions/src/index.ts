// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing
// TODO: Delete endpoint and (less importantly) update endpoint

// Needs to happen before persistence layer gets imported
import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";

import { ListingPayload } from "./types";
import type { RequestHandler } from "express";
import * as express from "express";
import { validateListing } from "./validation/ListingPayload";


import {
    addListing,
    deleteListing,
    getCharacterListings,
    getListing,
    getListingsForItem,
    getListingsFromRealm,
    isDuplicateListing,
    updateListing
} from "./persistence";
import * as timeout from "connect-timeout";

import { getCharacters, ownsCharacter } from "./validation/blizzard";
import { ensureAuthenticated, logRequest, logResponseBody } from "./middleware";
import { ITEMS } from "./data/items";

initializeApp(functions.config().firebase);

const haltOnTimedOut: RequestHandler = (req, res, next) => {
    if (!req.timedout) next();
};
const cors = require('cors')({ origin: true });

const app = express();
app.use(timeout(15000));
app.use(haltOnTimedOut);
app.use(cors);
app.use(logRequest);


// 1. Create Listing - <region, server, item, character, commission> tuple
// TODO: This is a god function that needs simplified.
app.post("/listings", ensureAuthenticated,
    async (request, response) => {
        switch (request.method) {
            case "POST": {
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
            default: {
                return response.sendStatus(405);
            }
        }
    });

// Update listing
app.put("/listings/:id", ensureAuthenticated,
    async (request, response) => {
        switch (request.method) {
            case "PUT": {
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

                const updatedItem = await updateListing(request.params.id, payload);
                functions.logger.debug(`Successfully updated Listing. Returning it: ${JSON.stringify(updatedItem)}`);
                return response.status(200).send(updatedItem);
            }
            default: {
                return response.sendStatus(405);
            }
        }
    });

// Delete specific id
app.delete("/listings/:id", ensureAuthenticated, async (request, response) => {
    switch (request.method) {
        case "DELETE": {
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
        default: {
            return response.sendStatus(405);
        }
    }
});

// Get all listings for a given WoW account
app.get("/:region/listings", ensureAuthenticated, async (request, response) => {
    switch (request.method) {
        case "GET": {
            request.headers["authorization"] = request.headers["authorization"] as string;

            // Get list of characters
            const characters = await getCharacters(request.params.region, request.headers["authorization"]);

            const listings = await getCharacterListings(characters);
            functions.logger.debug("Successfully retrieved listings: " + JSON.stringify(listings));
            return response.status(200).send(listings);
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

// 2. Get Items for Realm
app.get("/:region/:realm/items", async (request, response) => {
    switch (request.method) {
        case "GET": {
            const listings = await getListingsFromRealm(request.params.region, request.params.realm);
            functions.logger.debug(`Successfully retrieved listings: ${request.params.region}/${request.params.realm}: ${JSON.stringify(listings)}`);
            return response.status(200).send(listings);
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

// 3. Get Listings for Item
app.get("/:region/:realm/item/:id", async (request, response) => {
    switch (request.method) {
        case "GET": {
            const listings = await getListingsForItem(request.params.region, request.params.realm, parseInt(request.params.id));
            functions.logger.debug(`Successfully retrieved listings for ${request.params.region}/${request.params.realm} w/ Item ID${request.params.id}: ${JSON.stringify(listings)}`);
            return response.send(listings);
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

app.use(logResponseBody);
exports.app = functions.region("us-central1").https.onRequest(app);
