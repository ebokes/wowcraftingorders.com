import { RequestHandler } from "express";
import * as functions from "firebase-functions";

export const ensureAuthenticated: RequestHandler = (request, response, next) => {
    if (!request.headers["authorization"]) {
        functions.logger.error(`Missing authorization header on request to url ${request.url}`);
        return response.sendStatus(401);
    }
    return next();
}

export const logRequest: RequestHandler = (request, response, next) => {
    functions.logger.debug(`Request to url ${request.url}`);
    if (request.body) {
        functions.logger.debug(`Request body: ${JSON.stringify(request.body)}`);
    }
    return next();
}