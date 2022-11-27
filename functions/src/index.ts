import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Listing, ListingPayload } from "./types";
import * as express from "express";
import { validateListing } from "./schema";

const app = express();

admin.initializeApp(functions.config().firebase);

const LISTINGS_COLLECTION = "listings";

// 1. Create Listing - <region, server, item, character, commission> tuple
app.post("/listings",
    async (request, response) => {
        const db = admin.firestore();
        switch (request.method) {
            case "POST": {
                const payload = request.body as ListingPayload;
                const valid = validateListing(payload);
                if (!valid) {
                    response.status(400).send(validateListing.errors);
                    return;
                }
                await db.collection(LISTINGS_COLLECTION).add(payload);
                functions.logger.debug(`Successfully Posted: ${JSON.stringify(payload)}`);
                response.sendStatus(200);
                break;
            }
            default: {
                functions.logger.warn(`Illegal method ${request.method} on endpoint /listing`);
                response.sendStatus(405);
                break;
            }
        }
    });

// 2. Get Items for Realm
app.get("/:region/:realm/items", async (request, response) => {
    const db = admin.firestore();
    switch (request.method) {
        case "GET": {
            const listings = (await db.collection(LISTINGS_COLLECTION).get()).docs.map(doc => {
                return doc.data() as Listing;
            })
            functions.logger.debug(`Retrieved Listings: ${JSON.stringify(listings)}`);
            response.send(listings.filter(listing => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm
            }));
            break;
        }
        default: {
            functions.logger.warn(`Illegal method ${request.method} on endpoint /:region/:realm/items`);
            response.sendStatus(405);
            break;
        }
    }
});

// 3. Get Listings for Item
app.get("/:region/:realm/item/:itemId", async (request, response) => {
    const db = admin.firestore();
    switch (request.method) {
        case "GET": {
            const listings = (await db.collection(LISTINGS_COLLECTION).get()).docs.map(doc => {
                return doc.data() as Listing;
            })
            functions.logger.debug(`Retrieved Listings: ${JSON.stringify(listings)}`);

            response.send(listings.filter(listing => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm &&
                    listing.itemId === parseInt(request.params.itemId)
            }));
            break;
        }
        default: {
            functions.logger.warn(`Illegal method ${request.method} on endpoint /:region/:realm/:itemId`);
            response.sendStatus(405);
            break;
        }
    }
});

exports.app = functions.https.onRequest(app);
