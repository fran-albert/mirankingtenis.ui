import { TournamentCategory } from "../../domain/TournamentCategory";
import { TournamentCategoryRepository } from "../../domain/TournamentCategoryRepository";

export function getCategoriesForTournament(tournamentRepository: TournamentCategoryRepository) {
    return async (idTournament: number): Promise<TournamentCategory[]> => {
        return await tournamentRepository.getCategoriesForTournament(idTournament);
    };
}
