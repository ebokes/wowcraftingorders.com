import { RequestHandler } from "express";
import {
    deleteSellerListingService,
    getSellerListingsForItemService,
    getSellerListingsForRealmService,
    getSellerListingsForWowAccountService,
    saveSellerListingService,
    updateSellerListingService,
    updateSellerListingTimestampsService
} from "../services/sellerListingService";

/**
 * This file defines the "controllers" for the app, which are the functions that take a request and return a response.
 */
export const saveSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "POST": {
            return saveSellerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const updateSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "PUT": {
            return updateSellerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const deleteSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "DELETE": {
            return deleteSellerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForWowAccountController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getSellerListingsForWowAccountService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForRealmController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getSellerListingsForRealmService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForItemController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getSellerListingsForItemService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const updateSellerListingTimestampsController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return updateSellerListingTimestampsService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}