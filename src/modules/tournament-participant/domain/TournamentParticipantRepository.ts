import { TournamentParticipant } from "./TournamentParticipant";

export interface TournamentParticipantRepository {
    // createParticipantsForTournament: () => Promise<string>;
    getPlayersByTournament(idTournament: number): Promise<TournamentParticipant[]>;
    desactivatePlayer(idPlayer: number, idTournament: number): Promise<string>;
    getParticipantsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentParticipant[]>;
}
