import axiosInstance from "@/services/axiosConfig";
import { TournamentParticipant } from "../domain/TournamentParticipant";
import { TournamentParticipantRepository } from "../domain/TournamentParticipantRepository";

export function createApiTournamentParticipantRepository(): TournamentParticipantRepository {

    async function getPlayersByTournament(idTournament: number): Promise<TournamentParticipant[]> {
        const response = await axiosInstance.get(`tournament-participants/findAllPlayersByTournament/${idTournament}`);
        const tournament = response.data as TournamentParticipant[];
        return tournament;
    }

    async function getParticipantsByTournamentCategory(idTournament: number, idCategory: number): Promise<TournamentParticipant[]> {
        const response = await axiosInstance.get(`tournament-participants/getParticipantsByTournamentCategory/${idTournament}/${idCategory}`);
        const tournament = response.data as TournamentParticipant[];
        return tournament;
    }

    async function desactivatePlayer(idPlayer: number, tournamentId: number): Promise<string> {
        const response = await axiosInstance.post(`tournament-participants/desactivate/${idPlayer}/${tournamentId}/`);
        const user = response.data as string;
        return user;
    }

    async function createParticipantsForTournament(idTournament: number, idCategory: number, userIds: number[], positionInitials: number[]): Promise<TournamentParticipant[]> {
        const response = await axiosInstance.post(`tournament-participants`, { tournamentId: idTournament, categoryIds: idCategory, userIds, positionInitials });
        const tournament = response.data as TournamentParticipant[];
        return tournament;
    }

    return {
        getPlayersByTournament, desactivatePlayer, getParticipantsByTournamentCategory, createParticipantsForTournament
    };
}
