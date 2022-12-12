let COLLECTIONS_SUFFIX = "";
switch (process.env.APP_ENV) {
    case undefined:
    case "development":
    case "test": {
        COLLECTIONS_SUFFIX = "_test";
        break;
    }
    case "production": {
        COLLECTIONS_SUFFIX = "_prod";
        break;
    }
    default: {
        throw new Error(`Unknown environment: ${process.env.APP_ENV}`);
    }
}

export const LISTINGS_COLLECTION = "listings" + COLLECTIONS_SUFFIX;
export const BUYER_LISTINGS_COLLECTION = "buyer" + COLLECTIONS_SUFFIX;
