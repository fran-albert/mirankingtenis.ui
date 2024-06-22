import axiosInstance from "@/services/axiosConfig";
import { TournamentParticipant } from "../domain/TournamentParticipant";
import { TournamentParticipantRepository } from "../domain/TournamentParticipantRepository";
import { NonParticipantsDto } from "@/common/types/non-participants.dto";

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

    async function findNonParticipants(idTournament: number): Promise<NonParticipantsDto[]> {
        const response = await axiosInstance.get(`tournament-participants/non-participants/${idTournament}`);
        const tournament = response.data as NonParticipantsDto[];
        return tournament;
    }

    async function hasPlayersForCategory(idTournament: number, idCategory: number): Promise<boolean> {
        const response = await axiosInstance.get(`tournament-participants/has-players/${idTournament}/${idCategory}`);
        return response.data as boolean;
    }

    async function desactivatePlayer(idPlayer: number, tournamentId: number): Promise<string> {
        const response = await axiosInstance.post(`tournament-participants/desactivate/${idPlayer}/${tournamentId}/`);
        const user = response.data as string;
        return user;
    }

    async function createParticipantsForTournament(
        idTournament: number,
        idCategory: number,
        userIds: number[],
        positionInitials: number[]
    ): Promise<string> {
        const response = await axiosInstance.post(`tournament-participants`, {
            tournamentId: idTournament,
            categoryId: idCategory,
            userIds,
            positionInitials
        });
        return response.data as string;
    }


    return {
        findNonParticipants, getPlayersByTournament, hasPlayersForCategory, desactivatePlayer, getParticipantsByTournamentCategory, createParticipantsForTournament
    };
}
