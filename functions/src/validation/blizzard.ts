import axios from "axios";
import { Character } from "../types/types";
import { BattleNetProfileDataResponse } from "../types/blizzard_types";
import { REGIONS } from "../data/regions";

export class Blizzard401Error extends Error {
    constructor() {
        super()
    }
}

const blizzardApiRequest = async (url: string, namespace: string, token: string, region: string): Promise<BattleNetProfileDataResponse> => {
    const config = {
        headers: {
            "Authorization": token,
            "Accept-Encoding": "utf-8",
        },
        params: {
            "namespace": `${namespace}`,
            "locale": region === REGIONS.US ? "en_US" : "en_GB",
        }
    };
    console.log(`Requesting Blizzard API with url ${url} and config ${JSON.stringify(config)}.`);
    const response = await axios.get<BattleNetProfileDataResponse>(url, config);
    console.log("Response from Blizzard API: " + JSON.stringify(response.data));
    return response.data;
}

export const getCharacters = async (region: string, token: string): Promise<Character[]> => {
    let data = (await blizzardApiRequest(`https://${region}.api.blizzard.com/profile/user/wow`, `profile-${region}`, token, region)) as BattleNetProfileDataResponse;
    return data["wow_accounts"]
        .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
        .map((character: any) => ({ region, realm: character.realm.name, characterName: character.name }));
}

export const ownsCharacter = async (region: string, realm: string, characterName: string, token: string): Promise<boolean> => {
    const characters = await getCharacters(region, token);
    return characters.some(character => character.region === region && character.realm === realm && character.characterName === characterName);
}