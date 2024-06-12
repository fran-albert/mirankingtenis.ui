import { TournamentRanking } from "../domain/TournamentRanking";
import { TournamentRankingRepository } from "../domain/TournamentRankingRepository";

export function getAllRankingsByTournamentCategory(tournamentRankingRepository: TournamentRankingRepository) {
    return async (idTournament: number, idCategory: number): Promise<TournamentRanking[]> => {
        return await tournamentRankingRepository.getAllRankingsByTournamentCategory(idTournament, idCategory);
    };
}
