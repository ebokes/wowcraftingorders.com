import axios from "axios";
import { BattleNetProfileDataResponse } from "./types";

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
        console.debug(`Item ${itemId} does not exist.`);
        return false;
    }
};