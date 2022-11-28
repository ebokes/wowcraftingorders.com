// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ListingPayload } from "./types";
import * as express from "express";
import { validateListing } from "./ListingSchema";
import { addListing, getListings, isDuplicateListing } from "./persistence";

const app = express();
admin.initializeApp(functions.config().firebase);

// 1. Create Listing - <region, server, item, character, commission> tuple
app.post("/listings",
    async (request, response) => {
        response.set('Access-Control-Allow-Origin', '*');
        switch (request.method) {
            case "POST": {
                // Validate payload
                const payload = request.body as ListingPayload;
                let valid = validateListing(payload);

                // Manually handling because the logic is a bit complicated
                // TODO: See if I can build this directly into AJV
                if (!payload.commission.gold && !payload.commission.silver && !payload.commission.copper) {
                    valid = false;
                    response.status(400).send([{ message: "Commission must be nonzero." }]);
                    return;
                } else if (!valid) {
                    if (!validateListing.errors) {
                        functions.logger.error(`Unknown issue validating Listing payload: ${JSON.stringify(payload)}`)
                        response.status(400).send([{ message: "Unknown error. Please verify all fields are filled out and correct." }]);
                    } else {
                        response.status(400).send(validateListing.errors);
                    }
                    return;
                }

                // Check to see if duplicate
                // TODO: If I check for this, users need a way to delete and re-list. This requires some form of authentication - it's probably better to just go straight for Battle.net instead of trying Firebase.
                if (await isDuplicateListing(payload)) {
                    response.sendStatus(409);
                    return;
                }

                await addListing(payload);
                functions.logger.debug(`Successfully created Listing: ${JSON.stringify(payload)}`);
                response.sendStatus(201);
                break;
            }
            default: {
                response.sendStatus(405);
                break;
            }
        }

    });

// 2. Get Items for Realm
app.get("/:region/:realm/items", async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    switch (request.method) {
        case "GET": {
            const listings = await getListings();
            response.header("Access-Control-Allow-Origin", "*").send(listings.filter((listing) => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm;
            }));
            break;
        }
        default: {
            response.sendStatus(405);
            break;
        }
    }
});

// 3. Get Listings for Item
app.get("/:region/:realm/item/:itemId", async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    switch (request.method) {
        case "GET": {
            const listings = await getListings();
            response.send(listings.filter((listing) => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm &&
                    listing.itemId === parseInt(request.params.itemId);
            }));
            break;
        }
        default: {
            response.sendStatus(405);
            break;
        }
    }
});

exports.app = functions.https.onRequest(app);
