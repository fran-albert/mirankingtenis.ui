import { TournamentParticipant } from "../../domain/TournamentParticipant";
import { TournamentParticipantRepository } from "../../domain/TournamentParticipantRepository";

export function createParticipantsForTournament(tournamentParticipantRepository: TournamentParticipantRepository) {
    return async (idTournament: number, idCategory: number, userIds: number[], positionInitials: number[]): Promise<TournamentParticipant[]> => {
        return await tournamentParticipantRepository.createParticipantsForTournament(idTournament, idCategory, userIds, positionInitials);
    };
}
