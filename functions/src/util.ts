import axios from "axios";
import { BattleNetProfileDataResponse } from "./types";

export const itemExists = async (itemId: number, authHeader: string): Promise<boolean> => {
    try {
        await axios.get<BattleNetProfileDataResponse>(`https://us.api.blizzard.com/data/wow/item/${itemId}`, {
            headers: {
                "Authorization": authHeader,
                "Accept-Encoding": "utf-8",
            },
            params: {
                "namespace": "profile-us",
                "locale": "en_US"
            }
        })
        return true;
    } catch (err) {
        return false;
    }
};