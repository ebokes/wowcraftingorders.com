import { RequestHandler } from "express";

export const ensureAuthenticated: RequestHandler = (request, response, next) => {
    if (!request.headers["authorization"]) return response.sendStatus(401);
    return next();
}