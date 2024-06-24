import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { TournamentRanking } from "./TournamentRanking";
import { HistoryRankingDto } from "@/common/types/history-ranking.dto";

export interface TournamentRankingRepository {
    getAllRankingsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentRanking[]>;
    getHistoryRanking(idPlayer: number, idTournament: number, idCategory: number): Promise<HistoryRankingDto[]>;
    getTotalPlayerMatchSummary(idPlayer: number): Promise<MatchSummaryDto>;
    getTotalPlayerTournamentMatchSummary(idPlayer: number, idTournament: number, idCategory: number): Promise<MatchSummaryDto>;
}
