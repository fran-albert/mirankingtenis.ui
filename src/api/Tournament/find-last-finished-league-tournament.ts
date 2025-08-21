import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const findLastFinishedLeagueTournament = async (): Promise<Tournament> => {
    const response = await axiosInstance.get(`tournament/last-played`);
    const tournament = response.data as Tournament;
    return tournament;
}