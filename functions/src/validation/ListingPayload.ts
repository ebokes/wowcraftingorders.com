import { ListingPayload } from "../types";
import Ajv, { JSONSchemaType } from "ajv";
import { CustomError } from "./common";
// @ts-ignore
import list from "badwords-list";

const ajv = new Ajv({ allErrors: true });

require("ajv-errors")(ajv, { singleError: true });

const BAD_WORDS = list.array;

export const ListingSchema: JSONSchemaType<ListingPayload> = {
    type: "object",
    properties: {
        itemId: { type: "number", minimum: 0 },
        quality: { type: "string" },
        details: { type: "string", nullable: true },
        commission: {
            type: "object",
            properties: {
                gold: { type: "number", nullable: true, minimum: 0, maximum: 9999999 },
                silver: { type: "number", nullable: true, minimum: 0, maximum: 99 },
                copper: { type: "number", nullable: true, minimum: 0, maximum: 99 },
            },
        },
        seller: {
            type: "object",
            properties: {
                region: { type: "string", minLength: 2, maxLength: 2 }, // TODO: Validate against a list of regions
                realm: { type: "string", minLength: 1, maxLength: 100 },
                characterName: { type: "string", minLength: 2, maxLength: 12 },
                discordTag: { type: "string", nullable: true, pattern: "^.{3,32}#[0-9]{4}$" },
                battleNetTag: {
                    type: "string",
                    nullable: true,
                    pattern: "(^([A-zÀ-ú][A-zÀ-ú0-9]{2,11})|(^([а-яёА-ЯЁÀ-ú][а-яёА-ЯЁ0-9À-ú]{2,11})))(#[0-9]{4,})$", // https://eu.forums.blizzard.com/en/blizzard/t/battle-tag-regex-expression/444
                },
            },
            required: ["region", "realm", "characterName"],
            errorMessage: {
                required: {
                    region: "Region is required.",
                    realm: "Realm is required.",
                    characterName: "Character Name is required.",
                },
                properties: {
                    region: "Region must be a valid region.",
                    realm: "Realm must be a valid realm.",
                    characterName: "Character Name must be a valid character name.",
                    discordTag: "Discord Tag must be a valid Discord Tag.",
                    battleNetTag: "Battle.net Tag must be a valid Battle.net Tag.",
                }
            }
        },
        providedReagents: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    count: { type: "number", minimum: 1 },
                    reagent: {
                        type: "object",
                        properties: {
                            itemId: { type: "number", minimum: 0 },
                            required: { type: "boolean", nullable: true },
                            buyerProvides: { type: "boolean", nullable: true },
                        },
                        required: ["itemId"],
                    }
                },
                required: ["count", "reagent"],
            }
        }
    },
    required: ["itemId", "commission", "seller", "quality"],
    errorMessage: {
        required: {
            itemId: "Item is required.",
            commission: "Commission is required.",
        },
        properties: {
            itemId: "Item is not valid.",
        },
    }
};

const validateListingSchema = (payload: ListingPayload): CustomError[] => {
    const validate = ajv.compile(ListingSchema);
    validate(payload);
    if (!validate.errors) return [];
    return validate.errors.map(error => ({ message: error.message })) as CustomError[];
}
const validateListingBusiness = (payload: ListingPayload): CustomError[] => {
    const errors: CustomError[] = [];
    if (!payload.commission.gold && !payload.commission.silver && !payload.commission.copper) {
        errors.push({ message: "Commission must be nonzero." });
    }
    if (payload.details) {
        if (BAD_WORDS.reduce((acc: boolean, word: string) => acc || payload.details && payload.details.includes(word), false)) {
            errors.push({ message: "Please do not use inappropriate language in your additional details." });
        }
    }
    return errors;
}

export const validateListing = (payload: ListingPayload): CustomError[] => {
    const schemaErrors = validateListingSchema(payload);
    const businessErrors = validateListingBusiness(payload);
    return schemaErrors.concat(businessErrors);
}
