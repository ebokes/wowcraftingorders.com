import { RequestHandler } from "express";
import * as functions from "firebase-functions";

export const ensureAuthenticated: RequestHandler = (request, response, next) => {
    if (!request.headers["authorization"]) {
        functions.logger.error(`Missing authorization header on request to url ${request.url}`);
        return response.sendStatus(401);
    }
    return next();
}