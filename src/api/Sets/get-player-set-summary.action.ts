import axiosInstance from "@/services/axiosConfig";
import { SetSummaryDto } from "@/common/types/set-summary.dto";

export async function getTotalPlayerSetSummary(playerId: number): Promise<SetSummaryDto> {
    try {
        const response = await axiosInstance.get(`sets/players/${playerId}/set-summary`);
        const data = response.data as SetSummaryDto;
        return data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("Player set summary not found.");
            return {
                totalSetsPlayed: 0,
                totalSetsWon: 0,
                totalSetsLost: 0,
                winRate: "0%"
            } as SetSummaryDto;
        }
        console.error("Error fetching player set summary:", error);
        throw error;
    }
}