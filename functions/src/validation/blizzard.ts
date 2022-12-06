import axios from "axios";
import { Character } from "../types/types";
import { BattleNetProfileDataResponse, BNetCharacter } from "../types/blizzard_types";

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
    const response = await axios.get<BattleNetProfileDataResponse>(url, config);
    if (response.status !== 200) {
        console.error(`Blizzard API returned status code ${response.status} with config ${JSON.stringify(config)}. Full response object: ${JSON.stringify(response)}`);
    }
    console.log("Response from Blizzard API: " + JSON.stringify(response.data));
    return response.data;
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