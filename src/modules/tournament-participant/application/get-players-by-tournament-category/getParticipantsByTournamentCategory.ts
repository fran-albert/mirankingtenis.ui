import { TournamentParticipant } from "../../domain/TournamentParticipant";
import { TournamentParticipantRepository } from "../../domain/TournamentParticipantRepository";

export function getParticipantsByTournamentCategory(tournamentRepository: TournamentParticipantRepository) {
    return async (idTournament: number, idCategory: number): Promise<TournamentParticipant[]> => {
        return await tournamentRepository.getParticipantsByTournamentCategory(idTournament, idCategory);
    };
}
