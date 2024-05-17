import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

export function getTournament(tournamentRepository: TournamentRepository) {
    return async (id: number): Promise<Tournament> => {
        return await tournamentRepository.getTournament(id);
    };
}
