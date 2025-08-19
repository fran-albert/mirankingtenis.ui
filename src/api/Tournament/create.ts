import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const create = async (newTournament: Tournament): Promise<Tournament> => {
    const response = await axiosInstance.post(`tournament`, newTournament);
    const tournament = response.data as Tournament;
    return tournament;
}