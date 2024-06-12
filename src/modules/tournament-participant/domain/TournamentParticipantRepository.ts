import { TournamentParticipant } from "./TournamentParticipant";

export interface TournamentParticipantRepository {
    createParticipantsForTournament(idTournament: number, idCategory: number, userIds: number[], positionInitials: number[]): Promise<TournamentParticipant[]>;
    getPlayersByTournament(idTournament: number): Promise<TournamentParticipant[]>;
    desactivatePlayer(idPlayer: number, idTournament: number): Promise<string>;
    getParticipantsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentParticipant[]>;
}
