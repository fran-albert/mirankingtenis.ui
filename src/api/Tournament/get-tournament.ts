import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getTournament = async (idTournament: number): Promise<Tournament> => {
    const response = await axiosInstance.get(`tournament/${idTournament}`);
    const tournament = response.data as Tournament;
    return tournament;
}