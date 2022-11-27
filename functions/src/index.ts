import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Listing } from "./types";
import * as express from "express";

const app = express();

admin.initializeApp(functions.config().firebase);

const LISTINGS_COLLECTION = "listings";

// 1. Create Listing - <region, server, item, character, commission> tuple

// 2. Get Items for Realm
app.get("/:region/:realm/items", async (request, response) => {
    const db = admin.firestore();
    switch (request.method) {
        case "GET": {
            const listings = (await db.collection(LISTINGS_COLLECTION).get()).docs.map(doc => {
                return doc.data() as Listing;
            })

            response.send(listings.filter(listing => {
                return listing.seller.region === request.params.region &&
                    listing.seller.realm === request.params.realm
            }));
            break;
        }
        default: {
            functions.logger.warn(`Illegal method ${request.method} on endpoint /items`);
            response.sendStatus(405);
            break;
        }
    }
});

// 3. Get Listings for Item

exports.app = functions.https.onRequest(app);
