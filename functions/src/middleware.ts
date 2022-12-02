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

export const logResponseBody: RequestHandler = (req, res, next) => {
    const oldWrite = res.write,
        oldEnd = res.end;

    const chunks: any[] = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        // @ts-ignore
        return oldWrite.apply(res, arguments);
    };

    // @ts-ignore
    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);

        const body = Buffer.concat(chunks).toString('utf8');
        console.log(req.path, body);

        // @ts-ignore
        oldEnd.apply(res, arguments);
    };

    next();
}