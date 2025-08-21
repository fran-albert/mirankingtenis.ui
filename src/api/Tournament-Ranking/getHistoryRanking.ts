import { HistoryRankingDto } from "@/common/types/history-ranking.dto";
import axiosInstance from "@/services/axiosConfig";

export const getHistoryRanking = async (idPlayer: number, idTournament: number, idCategory: number): Promise<HistoryRankingDto[]> => {
    const response = await axiosInstance.get(`history-ranking/${idPlayer}/${idTournament}/${idCategory}`);
    return response.data as HistoryRankingDto[];
}