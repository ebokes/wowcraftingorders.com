import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Listing} from "./types";
admin.initializeApp(functions.config().firebase);

const LISTINGS_COLLECTION = "listings";
const SELLERS_COLLECTION = "sellers";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// Create <region, server, item, character, commission> tuple

// Get list of items for a given <region, realm> tuple
export const items = functions.https.onRequest(async (request, response) => {
  const db = admin.firestore();
  switch (request.method) {
    case "GET": {
      const region = request.body.region;
      const realm = request.body.realm;
      const listings = (await db.collection(LISTINGS_COLLECTION).get()).docs.map(doc => {

        return {
          id: doc.id;
          sellerId: doc.sellerId;
        } as Listing;
      })
      const sellers = await db.collection(SELLERS_COLLECTION).get();

      const itemsInRealm = listings.docs
          .filter(listing => {
            const seller = sellers.docs.find(seller => seller.id === listing.seller);
            if (!seller) {
              response.status(400).send(`Unable to find seller with id ${listing.seller}`)
              return;
            }
          })

      response.send();

      const returnValue = "Hello from Firebase!";
      functions.logger.info("Returning ", returnValue);
      response.send("Returning " + returnValue);
      break;
    }
    default: {
      functions.logger.warn(`Illegal method ${request.method} on endpoint /items`);
      response.sendStatus(405);
      break;
    }
  }
});

// Get sellers for a given item

