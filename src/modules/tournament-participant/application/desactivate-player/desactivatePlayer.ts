import { TournamentParticipantRepository } from "../../domain/TournamentParticipantRepository";


export function desactivatePlayer(tournamentRepository: TournamentParticipantRepository) {
    return async (idPlayer: number, tournamentId: number): Promise<string> => {
        return await tournamentRepository.desactivatePlayer(idPlayer, tournamentId);
    };
}
