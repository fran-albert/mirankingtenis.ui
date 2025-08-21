import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import axiosInstance from "@/services/axiosConfig";

export const getCategoriesForTournament = async (idTournament: number): Promise<TournamentCategory[]> => {
    const response = await axiosInstance.get(`tournament-categories/${idTournament}`);
    const tournament = response.data as TournamentCategory[];
    return tournament;
}