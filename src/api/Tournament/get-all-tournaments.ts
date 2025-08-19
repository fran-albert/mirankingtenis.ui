import { Tournament } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getAllTournaments = async (): Promise<Tournament[]> => {
    const response = await axiosInstance.get(`tournament`);
    const tournament = response.data as Tournament[];
    return tournament;
}