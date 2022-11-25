import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

// Create <server, item, character, commission> tuple


// Get list of items for a given <server> tuple
export const items = functions.https.onRequest((request, response) => {
  switch (request.method) {
    case "GET": {
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

