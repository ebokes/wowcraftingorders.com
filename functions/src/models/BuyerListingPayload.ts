import { BuyerListingPayload } from "../types/types";
import Ajv, { JSONSchemaType } from "ajv";
import { CustomError } from "../validation/common";
import { BAD_WORDS } from "../data/badwords";
import { ITEMS } from "../data/items";
import * as functions from "firebase-functions";

const ajv = new Ajv({ allErrors: true });

require("ajv-errors")(ajv, { singleError: true });

export const BuyerListingPayloadSchema: JSONSchemaType<BuyerListingPayload> = {
    type: "object",
    properties: {
        itemId: { type: "number", minimum: 0 },
        quality: { type: "string" },
        details: { type: "string", nullable: true, minLength: 0, maxLength: 200 },
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
            itemId: "Item ID must be a number greater than zero.",
            details: "Details must be a valid string <= 200 characters."
        },
    }
};

const validateBuyerListingSchema = (payload: BuyerListingPayload): CustomError[] => {
    const validate = ajv.compile(BuyerListingPayloadSchema);
    validate(payload);
    if (!validate.errors) return [];
    return validate.errors.map(error => ({ message: error.message })) as CustomError[];
}
const validateBuyerListingBusiness = (payload: BuyerListingPayload): CustomError[] => {
    const errors: CustomError[] = [];
    if (!payload.commission.gold && !payload.commission.silver && !payload.commission.copper) {
        errors.push({ message: "Commission must be nonzero." });
    }
    if (payload.details) {
        if (BAD_WORDS.find(word => payload.details && payload.details.toLowerCase().includes(word), false)) {
            errors.push({ message: "Please do not use inappropriate language in your additional details." });
        }
    }

    const item = ITEMS.find(item => item.id === payload.itemId);
    payload.providedReagents.map(reagent => {
        const reagentCount = item?.reagents.find(iterReagent => iterReagent.reagent.itemId === reagent.reagent.itemId)?.count;
        if (!reagentCount) {
            functions.logger.error(`Reagent ${reagent.reagent.itemId} not found in item ${payload.itemId} reagents.`);
            errors.push({ message: "Provided Reagent does not match the item's reagents." });
        }
        if (reagent.count > (reagentCount as number)) {
            errors.push({ message: "More reagents specified than the recipe takes." });
        }
    })
    return errors;
}

export const validateBuyerListing = (payload: BuyerListingPayload): CustomError[] => {
    const schemaErrors = validateBuyerListingSchema(payload);
    const businessErrors = validateBuyerListingBusiness(payload);
    return schemaErrors.concat(businessErrors);
}
