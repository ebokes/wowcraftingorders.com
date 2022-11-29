// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { ListingPayload } from "./types";
import * as express from "express";
import { validateListing } from "./ListingSchema";
import { addListing, getListings, isDuplicateListing } from "./persistence";
import * as session from "express-session";

import { config } from "dotenv";
import { defineString } from "firebase-functions/params";

config({ override: true });

const passport = require("passport");

const BATTLENET_CLIENT_ID = defineString("BATTLENET_CLIENT_ID");
const BATTLENET_CLIENT_SECRET = defineString("BATTLENET_CLIENT_SECRET");


const cors = require('cors')({ origin: true });
const app = express();
app.use(session({
    secret: "wqejfpiqweopfnsdaflsadnf;awlkdj",
    resave: false,
    saveUninitialized: true,
}));
app.use(cors);

app.use(passport.initialize());
app.use(passport.session());
const { Strategy: BNetStrategy } = require("passport-bnet");
passport.use(new BNetStrategy({
    clientID: BATTLENET_CLIENT_ID,
    clientSecret: BATTLENET_CLIENT_SECRET,
    callbackUrl: "https://wowtrade.xyz",
    region: "us"
    // @ts-ignore
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

initializeApp(functions.config().firebase);

// 1. Create Listing - <region, server, item, character, commission> tuple
// TODO: Validate the Battle.net access token; verify they own the character
app.post("/listings",
    async (request, response) => {
        passport.authenticate('bnet', { session: false }, async (err: any, user: any) => {
            functions.logger.info("User: " + JSON.stringify(user));
            switch (request.method) {
                case "POST": {
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

                    // Check to see if duplicate
                    // TODO: If I check for this, users need a way to delete and re-list. This requires some form of authentication - it's probably better to just go straight for Battle.net instead of trying Firebase.
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
