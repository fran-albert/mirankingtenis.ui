import axiosInstance from "@/services/axiosConfig";
import { TournamentRankingRepository } from "../domain/TournamentRankingRepository";
import { TournamentRanking } from "../domain/TournamentRanking";

export function createApiTournamentRankingRepository(): TournamentRankingRepository {

    async function findAllRankingsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentRanking[]> {
        const response = await axiosInstance.get(`tournament-ranking/findAllRankingsByTournamentCategory/${idTournament}/${idCategory}`);
        const tournament = response.data as TournamentRanking[];
        return tournament;
    }
    return {
        findAllRankingsByTournamentCategory
    };
}
