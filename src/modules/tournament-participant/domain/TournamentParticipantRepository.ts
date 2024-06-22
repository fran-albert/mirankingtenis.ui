import { NonParticipantsDto } from "@/common/types/non-participants.dto";
import { TournamentParticipant } from "./TournamentParticipant";

export interface TournamentParticipantRepository {
    createParticipantsForTournament(idTournament: number, idCategory: number, userIds: number[], positionInitials: number[]): Promise<string>;
    getPlayersByTournament(idTournament: number): Promise<TournamentParticipant[]>;
    desactivatePlayer(idPlayer: number, idTournament: number): Promise<string>;
    hasPlayersForCategory(idTournament: number, idCategory: number): Promise<boolean>;
    findNonParticipants(idTournament: number): Promise<NonParticipantsDto[]>;
    getParticipantsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentParticipant[]>;
}
