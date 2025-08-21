import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import axiosInstance from "@/services/axiosConfig";

export const getTotalPlayerTournamentMatchSummary = async (idPlayer: number, idTournament: number, idCategory: number): Promise<MatchSummaryDto> => {
    const response = await axiosInstance.get(`tournament-ranking/players/${idPlayer}/match-summary/${idTournament}/category/${idCategory}`);
    return response.data as MatchSummaryDto;
}