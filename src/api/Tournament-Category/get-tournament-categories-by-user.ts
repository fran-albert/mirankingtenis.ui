import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import axiosInstance from "@/services/axiosConfig";

export const getTournamentCategoriesByUser = async (idUser: number): Promise<any[]> => {
    const response = await axiosInstance.get(`tournament-categories/user/${idUser}`);
    const tournament = response.data as TournamentCategory[];
    return tournament;
}