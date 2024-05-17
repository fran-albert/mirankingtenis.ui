import { TournamentParticipant } from "../../domain/TournamentParticipant";
import { TournamentParticipantRepository } from "../../domain/TournamentParticipantRepository";

export function getPlayersByTournament(tournamentParticipant: TournamentParticipantRepository) {
    return async (idTournament: number): Promise<TournamentParticipant[]> => {
        return await tournamentParticipant.getPlayersByTournament(idTournament);
    };
}
