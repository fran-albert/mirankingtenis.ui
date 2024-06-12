import { TournamentCategory } from "../../domain/TournamentCategory";
import { TournamentCategoryRepository } from "../../domain/TournamentCategoryRepository";

export function createCategoryForTournament(tournamentRepository: TournamentCategoryRepository) {
    return async (idTournament: number, idCategory: number[]): Promise<TournamentCategory[]> => {
        return await tournamentRepository.createCategoryForTournament(idTournament, idCategory);
    };
}
