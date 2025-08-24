import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export interface CreateTournamentRequest {
    name: string;
    type: string;
    configuration?: {
        winnerPoints: number;
        loserPoints: number;
        decideMatchWinnerPoints: number;
        decideMatchLoserPoints: number;
    };
}

export const create = async (newTournament: CreateTournamentRequest): Promise<Tournament> => {
    const response = await axiosInstance.post(`tournament`, newTournament);
    const tournament = response.data as Tournament;
    return tournament;
}