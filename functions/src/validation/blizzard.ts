import axios, { AxiosError } from "axios";
import { Character } from "../types/types";
import { BattleNetProfileDataResponse, BNetCharacter } from "../types/blizzard_types";

export class Blizzard401Error extends Error {
    constructor() {
        super()
    }
}

const blizzardApiRequest = async (url: string, namespace: string, token: string): Promise<BattleNetProfileDataResponse | object> => {
    console.log("Requesting Blizzard API with url: " + url);
    const config = {
        headers: {
            "Authorization": token,
            "Accept-Encoding": "utf-8",
        },
        params: {
            "namespace": `${namespace}`,
            "locale": "en_US",
        }
    };
    try {
        const response = await axios.get<BattleNetProfileDataResponse>(url, config);
        console.log("Response from Blizzard API: " + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && (error as AxiosError).status === 401) {
            throw new Blizzard401Error();
        }
        throw error;
    }
}

export const getCharacters = async (region: string, token: string): Promise<Character[]> => {
    let data = (await blizzardApiRequest(`https://${region}.api.blizzard.com/profile/user/wow`, `profile-${region}`, token)) as BattleNetProfileDataResponse;
    return data["wow_accounts"]
        .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
        .map((character: any) => ({ region, realm: character.realm.name, characterName: character.name }));
}

export const ownsCharacter = async (region: string, realm: string, characterName: string, token: string): Promise<boolean> => {
    const data = await blizzardApiRequest(`https://${region}.api.blizzard.com/profile/user/wow`, `profile-${region}`, token) as BattleNetProfileDataResponse;
    const charactersInRealm = data["wow_accounts"]
        .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
        .filter((character: BNetCharacter) => character.realm.name.toLowerCase() === realm.toLowerCase() && character.name.toLowerCase() === characterName.toLowerCase());
    return charactersInRealm.length !== 0;
}