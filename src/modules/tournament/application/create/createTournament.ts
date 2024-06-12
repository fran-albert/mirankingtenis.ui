import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

export function createTournament(tournamentRepository: TournamentRepository) {
    return async (newTournament: Tournament): Promise<Tournament> => {
        return await tournamentRepository.create(newTournament);
    };
}
