"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const IDs = "i:191492,i:190516,i:198226,i:193001,i:194894,i:191491,i:192081,i:193449,i:194872,i:198326,i:191228,i:191223,i:190510,i:193494,i:198478,i:190507,i:194126,i:190509,i:193400,i:198335,i:190514,i:198244,i:190511,i:191226,i:193399,i:190501,i:190515,i:198477,i:190518,i:191224,i:193493,i:193540,i:198263,i:193544,i:193408,i:190523,i:193542,i:190522,i:198324,i:193000,i:191231,i:193455,i:193496,i:192999,i:193422,i:190508,i:193545,i:193543,i:191985,i:193421,i:201759,i:198325,i:193423,i:193613,i:191225,i:191888,i:190495,i:193451,i:193488,i:193424,i:193492,i:198716,i:193406,i:191230,i:193466,i:191623,i:193042,i:193490,i:193398,i:193407,i:191232,i:198481,i:193452,i:193533,i:191229,i:200642,i:190503,i:191227,i:193460,i:193461,i:193520,i:193003,i:193516,i:198323,i:194898,i:193526,i:193006,i:193523,i:194875,i:198205,i:190513,i:193041,i:193463,i:198327,i:193511,i:193489,i:190500,i:193508,i:198333,i:193509,i:193462,i:190505,i:190498,i:193459,i:193536,i:198332,i:194897,i:198235,i:193039,i:190502,i:193453,i:193419,i:193040,i:190512,i:193464,i:190517,i:193425,i:190519,i:201366,i:193454,i:193456,i:193616,i:193532,i:193005,i:193527,i:193491,i:193537,i:193426,i:194879,i:198246,i:193458,i:193521,i:193418,i:193513,i:190506,i:193512,i:190496,i:193524,i:193428,i:193510,i:193465,i:198322,i:192893,i:193427,i:193525,i:193504,i:190499,i:193002,i:193457,i:193004,i:193530,i:190526,i:193519,i:190497,i:193518,i:201930".split(",").map((id) => id.replace("i:", ""));
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const run = async () => {
    try {
        // Doing it this weird way to avoid rate limiting / quota
        const ITEMS_AT_A_TIME = 50;
        const SECONDS_BETWEEN_REQUESTS = 2;
        let responses = [];
        let index = 0;
        while (index < IDs.length) {
            console.log(`Processing ${index} of ${IDs.length}`);
            responses = responses.concat(await Promise.all(IDs.slice(index, index + ITEMS_AT_A_TIME).map(async (id) => {
                return axios_1.default.get(`https://us.api.blizzard.com/data/wow/item/${id}`, {
                    headers: {
                        "Authorization": "Bearer USYcvLsirwOcZnJo56FYK5GtWHhuy6fJS2",
                        "Accept-Encoding": "utf-8",
                    },
                    params: {
                        "namespace": "static-us",
                        "locale": "en_US"
                    }
                });
            })));
            await sleep(SECONDS_BETWEEN_REQUESTS * 1000);
            index += ITEMS_AT_A_TIME;
        }
        const items = responses.map((response) => blizzardItemToItem(response.data));
        console.log(items);
        const fs = require('fs');
        fs.writeFile("test.json", JSON.stringify(items), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    catch (err) {
        console.error(err);
    }
};
const blizzardItemToItem = (blizzardItem) => {
    return {
        id: blizzardItem.id,
        name: blizzardItem.name,
        itemLevel: blizzardItem.level
    };
};
run();
