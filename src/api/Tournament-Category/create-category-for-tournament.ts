import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import axiosInstance from "@/services/axiosConfig";

export const createCategoryForTournament = async (idTournament: number, idCategory: number[]): Promise<TournamentCategory[]> => {
    const response = await axiosInstance.post(`tournament-categories`, { tournamentId: idTournament, categoryIds: idCategory });
    const tournament = response.data as TournamentCategory[];
    return tournament;
}