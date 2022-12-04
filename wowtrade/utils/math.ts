import { Commission } from "../types/types";

export function getTotalValueOfCommission(commission: Commission): number {
    return (commission.gold ?? 0) * 100 * 100 + (commission.silver ?? 0) * 100 + (commission.copper ?? 0);
}