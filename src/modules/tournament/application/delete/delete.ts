import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

export function deleteTournament(tournamentRepository: TournamentRepository) {
    return async (id: number): Promise<string> => {
        return await tournamentRepository.deleteTournament(id);
    };
}
