import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";


export function getAllTournaments(tournamentRepository: TournamentRepository) {
    return async (): Promise<Tournament[]> => {
        return await tournamentRepository.getAllTournaments();
    };
}
