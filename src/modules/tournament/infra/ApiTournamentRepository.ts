import axiosInstance from "@/services/axiosConfig";
import { TournamentRepository } from "../domain/TournamentRepository";
import { Tournament } from "../domain/Tournament";
import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";

export function createApiTournamentRepository(): TournamentRepository {

    async function create(newTournament: Tournament): Promise<Tournament> {
        const response = await axiosInstance.post(`tournament`, newTournament);
        const tournament = response.data as Tournament;
        return tournament;
    }

    async function getTournament(idTournament: number): Promise<Tournament> {
        const response = await axiosInstance.get(`tournament/${idTournament}`);
        const tournament = response.data as Tournament;
        return tournament;
    }

    async function startTournament(idTournament: number): Promise<string> {
        const response = await axiosInstance.post(`tournament/start/${idTournament}`);
        const tournament = response.data as string;
        return tournament;
    }

    async function finishTournament(idTournament: number): Promise<string> {
        const response = await axiosInstance.post(`tournament/finish/${idTournament}`);
        const tournament = response.data as string;
        return tournament;
    }

    async function getPlayerInfo(idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto> {
        const response = await axiosInstance.get(`tournament/${idTournament}/players/${idPlayer}`);
        const tournament = response.data as any;
        return tournament;
    }

    async function getCurrentTournamentByPlayer(idPlayer: number): Promise<Tournament> {
        const response = await axiosInstance.get(`tournament/players/${idPlayer}/current-tournament`);
        const tournament = response.data as Tournament;
        return tournament;
    }

    async function getAllTournamentsByPlayer(idPlayer: number): Promise<Tournament[]> {
        const response = await axiosInstance.get(`tournament/players/${idPlayer}/tournaments`);
        const tournament = response.data as Tournament[];
        return tournament;
    }

    async function getCompletedTournamentsByPlayer(idPlayer: number): Promise<Tournament[]> {
        const response = await axiosInstance.get(`tournament/players/${idPlayer}/completed-tournaments`);
        const tournament = response.data as Tournament[];
        return tournament;
    }

    async function isCurrentTournament(idTournament: number): Promise<boolean> {
        const response = await axiosInstance.get(`tournament/${idTournament}/is-current`);
        const tournament = response.data as boolean;
        return tournament;
    }


    async function deleteTournament(idTournament: number): Promise<string> {
        const response = await axiosInstance.delete(`tournament/${idTournament}`);
        const tournament = response.data as string;
        return tournament;
    }

    async function getAllTournaments(): Promise<Tournament[]> {
        const response = await axiosInstance.get(`tournament`);
        const tournament = response.data as Tournament[];
        return tournament;
    }

    async function getTotalTournaments(): Promise<number> {
        const response = await axiosInstance.get(`tournament`);
        const tournament = response.data.length;
        return tournament;
    }



    return {
        getAllTournaments, getCompletedTournamentsByPlayer, getAllTournamentsByPlayer, getPlayerInfo, getCurrentTournamentByPlayer, isCurrentTournament, create, deleteTournament, startTournament, finishTournament, getTournament, getTotalTournaments
    };
}
