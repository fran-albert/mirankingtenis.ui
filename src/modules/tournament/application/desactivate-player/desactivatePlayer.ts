import { TournamentRepository } from "../../domain/TournamentRepository";


export function desactivatePlayer(tournamentRepository: TournamentRepository) {
    return async (idPlayer: number, tournamentId: number): Promise<string> => {
        return await tournamentRepository.desactivatePlayer(idPlayer, tournamentId);
    };
}
