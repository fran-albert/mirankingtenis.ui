import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { TournamentRanking } from "./TournamentRanking";

export interface TournamentRankingRepository {
    getAllRankingsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentRanking[]>;
    getTotalPlayerMatchSummary(idPlayer: number): Promise<MatchSummaryDto>;
}
