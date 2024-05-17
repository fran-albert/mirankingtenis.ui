import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

export function finishTournament(tournamentRepository: TournamentRepository) {
    return async (id: number): Promise<string> => {
        return await tournamentRepository.finishTournament(id);
    };
}
