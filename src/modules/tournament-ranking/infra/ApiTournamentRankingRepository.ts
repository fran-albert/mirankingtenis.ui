import axiosInstance from "@/services/axiosConfig";
import { TournamentRankingRepository } from "../domain/TournamentRankingRepository";
import { TournamentRanking } from "../domain/TournamentRanking";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { HistoryRankingDto } from "@/common/types/history-ranking.dto";

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

    async function getTotalPlayerTournamentMatchSummary(idPlayer: number, idTournament: number, idCategory: number): Promise<MatchSummaryDto> {
        const response = await axiosInstance.get(`tournament-ranking/players/${idPlayer}/match-summary/${idTournament}/category/${idCategory}`);
        return response.data as MatchSummaryDto;
    }
    async function getHistoryRanking(idPlayer: number, idTournament: number, idCategory: number): Promise<HistoryRankingDto[]> {
        const response = await axiosInstance.get(`history-ranking/${idPlayer}/${idTournament}/${idCategory}`);
        return response.data as HistoryRankingDto[];
    }

    return {
        getAllRankingsByTournamentCategory, getTotalPlayerMatchSummary, getHistoryRanking, getTotalPlayerTournamentMatchSummary
    };
}
