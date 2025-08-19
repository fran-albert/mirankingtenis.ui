import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import axiosInstance from "@/services/axiosConfig";

export const getTotalPlayerMatchSummary = async (idPlayer: number): Promise<MatchSummaryDto> => {
    const response = await axiosInstance.get(`tournament-ranking/players/${idPlayer}/match-summary`);
    return response.data;
}