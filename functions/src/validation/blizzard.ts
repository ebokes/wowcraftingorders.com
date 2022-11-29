import axios from "axios";
import { BattleNetProfileDataResponse, Character } from "../types";

const blizzardApiRequest = async (url: string, namespace: string, token: string): Promise<BattleNetProfileDataResponse | object> => {
    const config = {
        headers: {
            "Authorization": token,
            "Accept-Encoding": "utf-8",
        },
        params: {
            "namespace": `${namespace}`,
            "locale": "en_US"
        }
    };
    const response = await axios.get<BattleNetProfileDataResponse>(url, config);
    return response.data;
}

export const getCharacters = async (region: string, token: string): Promise<Character[]> => {
    let data = (await blizzardApiRequest("https://us.api.blizzard.com/profile/user/wow", "profile-us", token)) as BattleNetProfileDataResponse;
    return data["wow_accounts"]
        .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
        .map((character: any) => ({ region, realm: character.realm.name, characterName: character.name }));
}

export const ownsCharacter = async (region: string, realm: string, characterName: string, token: string): Promise<boolean> => {
    const data = await blizzardApiRequest(`https://us.api.blizzard.com/profile/user/wow`, `profile-us`, token) as BattleNetProfileDataResponse;
    const charactersInRealm = data["wow_accounts"]
        .reduce((acc: any, curr: any) => acc.concat(curr.characters), [])
        .filter((character: any) => character.realm.name.toLowerCase() === realm.toLowerCase() && character.name.toLowerCase() === characterName.toLowerCase());
    return charactersInRealm.length !== 0;
}

export const itemExists = async (itemId: number, authHeader: string): Promise<boolean> => {
    try {
        const response = await axios.get<BattleNetProfileDataResponse>(`https://us.api.blizzard.com/data/wow/item/${itemId}`, {
            headers: {
                "Authorization": authHeader,
                "Accept-Encoding": "utf-8",
            },
            params: {
                "namespace": "static-us",
                "locale": "en_US"
            }
        })
        return response.status === 200;
    } catch (err) {
        return false;
    }
};