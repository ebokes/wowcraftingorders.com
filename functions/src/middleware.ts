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
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks: readonly Uint8Array[] | Buffer[] = [];

    // @ts-ignore
    res.write = (...restArgs) => {
        // @ts-ignore
        chunks.push(Buffer.from(restArgs[0]));
        // @ts-ignore
        oldWrite.apply(res, restArgs);
    };

    // @ts-ignore
    res.end = (...restArgs) => {
        if (restArgs[0]) {
            // @ts-ignore
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString('utf8');

        console.log({
            time: new Date().toUTCString(),
            fromIP: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress,
            method: req.method,
            originalUri: req.originalUrl,
            uri: req.url,
            requestData: req.body,
            responseData: body,
            referer: req.headers.referer || '',
            ua: req.headers['user-agent']
        });

        // @ts-ignore
        oldEnd.apply(res, restArgs);
    };

    next();
}