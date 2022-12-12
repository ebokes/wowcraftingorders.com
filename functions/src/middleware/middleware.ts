import { RequestHandler } from "express";
import * as functions from "firebase-functions";
import axios from "axios";

export const ensureAuthenticated: RequestHandler = async (request, response, next) => {
    if (!request.headers["authorization"]) {
        functions.logger.error(`Missing authorization header on request to url ${request.url}`);
        return response.sendStatus(401);
    }
    const AUTH_TOKEN = request.headers["authorization"].split(" ")[1];

    const checkTokenResponse = await axios.get("https://oauth.battle.net/oauth/check_token", {
        params: {
            token: AUTH_TOKEN,
        }
    });
    if (checkTokenResponse.status !== 200) {
        functions.logger.warn(`Token check returned status ${checkTokenResponse.status} with reason ${checkTokenResponse.data.reason}`);
        if (checkTokenResponse.status === 401 || checkTokenResponse.status === 403) {
            functions.logger.warn(`Authorization error checking token.`);
            return response.sendStatus(401);
        }
        functions.logger.error(`Unknown error checking token.`);
        return response.sendStatus(500);
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