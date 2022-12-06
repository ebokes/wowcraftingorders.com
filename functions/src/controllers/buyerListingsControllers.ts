import { RequestHandler } from "express";
import {
    deleteBuyerListingService,
    getBuyerListingsForItemService,
    getBuyerListingsForRealmService,
    getBuyerListingsForWowAccountService,
    saveBuyerListingService,
    updateBuyerListingService,
    updateBuyerListingTimestampsService
} from "../services/buyerListingService";

/**
 * This file defines the "controllers" for the app, which are the functions that take a request and return a response.
 */
export const saveBuyerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "POST": {
            return saveBuyerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const updateBuyerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "PUT": {
            return updateBuyerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
};

export const deleteBuyerListingController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "DELETE": {
            return deleteBuyerListingService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getBuyerListingsForWowAccountController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getBuyerListingsForWowAccountService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getBuyerListingsForRealmController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getBuyerListingsForRealmService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const getBuyerListingsForItemController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return getBuyerListingsForItemService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}

export const updateBuyerListingTimestampsController: RequestHandler = async (request, response, next) => {
    switch (request.method) {
        case "GET": {
            return updateBuyerListingTimestampsService(request, response, next);
        }
        default: {
            return response.sendStatus(405);
        }
    }
}