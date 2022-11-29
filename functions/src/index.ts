// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing
// TODO: Delete endpoint and (less importantly) update endpoint

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { ListingPayload } from "./types";
import type { RequestHandler } from "express";
import * as express from "express";
import { validateListing } from "./validation/ListingPayload";
import {
    addListing,
    deleteListing,
    getCharacterListings,
    getListing,
    getListings,
    isDuplicateListing
} from "./persistence";
import * as timeout from "connect-timeout";

import { getCharacters, itemExists, ownsCharacter } from "./validation/blizzard";
import { ensureAuthenticated } from "./middleware";

const haltOnTimedOut: RequestHandler = (req, res, next) => {
    if (!req.timedout) next();
};
const cors = require('cors')({ origin: true });

const app = express();
app.use(timeout(5000));
app.use(haltOnTimedOut);
app.use(cors);

initializeApp(functions.config().firebase);

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
                const exists = await itemExists(payload.itemId, request.headers["authorization"]);
                if (!exists) {
                    return response.status(400).send([{ message: "Item does not exist." }]);
                }

                // Doesn't own character
                if (!ownsCharacter(payload.seller.region, payload.seller.realm, payload.seller.characterName, request.headers["authorization"])) {
                    return response.status(400).send([{ message: "Character does not exist." }]);
                }

                // Already has listing
                if (await isDuplicateListing(payload)) {
                    return response.sendStatus(409);
                }

                await addListing(payload);
                functions.logger.debug(`Successfully created Listing: ${JSON.stringify(payload)}`);
                return response.sendStatus(201);
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
            if (!ownsCharacter(listing.seller.region, listing.seller.realm, listing.seller.characterName, request.headers["authorization"])) {
                return response.status(400).send([{ message: "Character does not exist." }]);
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
            const listings = await getListings();
            const result = listings.filter((listing) => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm;
            });
            functions.logger.debug(`Successfully retrieved Listings for ${request.params.region}/${request.params.realm}: ${JSON.stringify(result)}`);
            return response.status(200).send(result);
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

// 3. Get Listings for Item
app.get("/:region/:realm/item/:itemId", async (request, response) => {
    switch (request.method) {
        case "GET": {
            const listings = await getListings();
            const result = listings.filter((listing) => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm &&
                    listing.itemId === parseInt(request.params.itemId);
            });
            functions.logger.debug(`Successfully retrieved Listings for ${request.params.region}/${request.params.realm} w/ Item ID${request.params.itemId}: ${JSON.stringify(result)}`);
            return response.send(result);
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

exports.app = functions.region("us-central1").https.onRequest(app);
