import { TournamentRanking } from "@/modules/tournament-ranking/domain/TournamentRanking";
import axiosInstance from "@/services/axiosConfig";

export const getAllRankingsByTournamentCategory = async (idTournament: number, idCategory: number): Promise<TournamentRanking[]> => {
    const response = await axiosInstance.get(`tournament-ranking/findAllRankingsByTournamentCategory/${idTournament}/${idCategory}`);
    const tournament = response.data as TournamentRanking[];
    return tournament;
}
