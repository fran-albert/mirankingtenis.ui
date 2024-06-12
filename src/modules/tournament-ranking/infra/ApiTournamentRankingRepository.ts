import axiosInstance from "@/services/axiosConfig";
import { TournamentRankingRepository } from "../domain/TournamentRankingRepository";
import { TournamentRanking } from "../domain/TournamentRanking";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";

export function createApiTournamentRankingRepository(): TournamentRankingRepository {

    async function getAllRankingsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentRanking[]> {
        const response = await axiosInstance.get(`tournament-ranking/findAllRankingsByTournamentCategory/${idTournament}/${idCategory}`);
        const tournament = response.data as TournamentRanking[];
        return tournament;
    }

    async function getTotalPlayerMatchSummary(idPlayer: number): Promise<MatchSummaryDto> {
        const response = await axiosInstance.get(`tournament-ranking/players/${idPlayer}/match-summary`);
        return response.data;
    }

    return {
        getAllRankingsByTournamentCategory, getTotalPlayerMatchSummary
    };
}
