import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getLastTournamentByPlayer = async (idPlayer: number): Promise<Tournament> => {
    const response = await axiosInstance.get(`tournament/last-tournament/${idPlayer}`);
    const tournament = response.data as Tournament;
    return tournament;
}