// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing
// TODO: Delete endpoint and (less importantly) update endpoint

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { ListingPayload } from "./types";
import type { RequestHandler } from "express";
import * as express from "express";
import { validateListing } from "./ListingSchema";
import { addListing, getListings, isDuplicateListing } from "./persistence";
import * as timeout from "connect-timeout";

import axios from "axios";

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
app.post("/listings",
    async (request, response) => {
        switch (request.method) {
            case "POST": {
                if (!request.headers["authorization"]) {
                    response.status(401).send("Authorization header is required.");
                    return;
                }
                functions.logger.debug("Token: " + JSON.stringify(request.headers["authorization"]));

                // Validate payload
                const payload = request.body as ListingPayload;
                let valid = validateListing(payload);

                // Manually handling because the logic is a bit complicated
                // TODO: See if I can build this directly into AJV
                if (!payload.commission.gold && !payload.commission.silver && !payload.commission.copper) {
                    valid = false;
                    return response.status(400).send([{ message: "Commission must be nonzero." }]);
                } else if (!valid) {
                    if (!validateListing.errors) {
                        functions.logger.error(`Unknown issue validating Listing payload: ${JSON.stringify(payload)}`)
                        return response.status(400).send([{ message: "Unknown error. Please verify all fields are filled out and correct." }]);
                    } else {
                        return response.status(400).send(validateListing.errors);
                    }
                }

                // Validate that they own the character in question
                const profileDataResponse = await axios.get("https://us.api.blizzard.com/profile/user/wow", {
                    headers: {
                        "Authorization": request.headers["authorization"]
                    }
                })

                // TODO: I should make actual types for these
                if (profileDataResponse.status !== 200) return response.sendStatus(401);
                const profileData: any = await profileDataResponse.data();
                const charactersInRealm = profileData.wow_accounts
                    .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
                    .filter((character: any) => character.realm.name.toLowerCase() === payload.seller.realm.toLowerCase() && character.name.toLowerCase() === payload.seller.characterName.toLowerCase());
                if (charactersInRealm.length === 0) return response.status(401).send([{ message: "You do not own this character." }]);

                // Check to see if duplicate
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
            return response.send();
        }
        default: {
            return response.sendStatus(405);
        }
    }
});

exports.app = functions.region("us-central1").https.onRequest(app);
