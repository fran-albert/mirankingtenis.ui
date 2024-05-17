import { TournamentRanking } from "./TournamentRanking";

export interface TournamentRankingRepository {
    findAllRankingsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentRanking[]>;
}
