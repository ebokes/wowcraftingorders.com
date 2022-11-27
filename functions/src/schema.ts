import { ListingPayload } from "./types";
import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();

const schema: JSONSchemaType<ListingPayload> = {
    type: "object",
    properties: {
        itemId: { type: "number", minimum: 0 },
        commission: {
            type: "object",
            properties: {
                gold: { type: "number", minimum: 0, maximum: 9999999 },
                silver: { type: "number", minimum: 0, maximum: 99 },
                copper: { type: "number", minimum: 0, maximum: 99 },
            },
            required: ["gold", "silver", "copper"],
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
                    // eslint-disable-next-line max-len
                    pattern: "(^([A-zÀ-ú][A-zÀ-ú0-9]{2,11})|(^([а-яёА-ЯЁÀ-ú][а-яёА-ЯЁ0-9À-ú]{2,11})))(#[0-9]{4,})$", // https://eu.forums.blizzard.com/en/blizzard/t/battle-tag-regex-expression/444
                },
            },
            required: ["region", "realm", "characterName"],
        },
    },
    required: ["itemId", "commission", "seller"],
};
export const validateListing = ajv.compile(schema);
