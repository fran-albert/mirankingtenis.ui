import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

export function startTournament(tournamentRepository: TournamentRepository) {
    return async (id: number): Promise<any[]> => {
        return await tournamentRepository.startTournament(id);
    };
}
