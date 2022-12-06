import { RequestHandler } from "express";
import {
    deleteListingService,
    getListingsForItemService,
    getListingsForRealmService,
    getListingsForWowAccountService,
    saveListingService,
    updateListingService,
    updateListingTimestampsService
} from "../services/listing_service";

/**
 * This file defines the "controllers" for the app, which are the functions that take a request and return a response.
 */
export const saveSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "POST": {
            return saveListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const updateSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "PUT": {
            return updateListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const deleteSellerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "DELETE": {
            return deleteListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForWowAccountController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getListingsForWowAccountService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForRealmController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getListingsForRealmService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getSellerListingsForItemController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getListingsForItemService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const updateListingTimestampsController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return updateListingTimestampsService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}