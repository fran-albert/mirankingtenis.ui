import axiosInstance from "@/services/axiosConfig";
import { TournamentRepository } from "../domain/TournamentRepository";
import { Tournament } from "../domain/Tournament";

export function createApiTournamentRepository(): TournamentRepository {


    async function getAllTournaments(): Promise<Tournament[]> {
        const response = await axiosInstance.get(`tournament`);
        const tournament = response.data as Tournament[];
        return tournament;
    }

    async function desactivatePlayer(idPlayer: number, tournamentId: number): Promise<string> {
        const response = await axiosInstance.post(`tournament/desactivate/${idPlayer}/${tournamentId}/`);
        const user = response.data as string;
        return user;
    }

    return {
        desactivatePlayer, getAllTournaments
    };
}
