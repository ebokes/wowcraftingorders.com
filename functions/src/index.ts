// TODO: Split business logic into its own layer that'll be between this and persistence layer
// TODO: Write unit tests https://firebase.google.com/docs/functions/unit-testing
// TODO: Delete endpoint and (less importantly) update endpoint

// Needs to happen before persistence layer gets imported
import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";

import type { RequestHandler } from "express";
import * as express from "express";
import * as timeout from "connect-timeout";
import { logRequest, logResponseBody } from "./middleware";

initializeApp(functions.config().firebase);

const haltOnTimedOut: RequestHandler = (req, res, next) => {
    if (!req.timedout) next();
};
const cors = require('cors')({ origin: true });

export const app = express();
app.use(timeout(15000));
app.use(haltOnTimedOut);
app.use(cors);
app.use(logRequest);

app.use(require("./routes/routes"));

app.use(logResponseBody);
exports.app = functions.region("us-central1").https.onRequest(app);
