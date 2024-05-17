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

    // async function createCourt(newCourt: Court): Promise<Court> {
    //     const response = await axiosInstance.post("court", newCourt);
    //     const c = response.data as Court;
    //     return c;
    // }

    async function desactivatePlayer(idPlayer: number, tournamentId: number): Promise<string> {
        const response = await axiosInstance.post(`tournament-participants/desactivate/${idPlayer}/${tournamentId}/`);
        const user = response.data as string;
        return user;
    }



    return {
        getPlayersByTournament, desactivatePlayer, getParticipantsByTournamentCategory
    };
}
