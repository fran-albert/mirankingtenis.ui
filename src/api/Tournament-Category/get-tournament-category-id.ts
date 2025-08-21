import axiosInstance from "@/services/axiosConfig";

export const getTournamentCategoryId = async (idTournament: number, idCategory: number): Promise<number> => {
    const response = await axiosInstance.get(`tournament-categories/${idTournament}/${idCategory}`);
    const tournament = response.data as number;
    return tournament;
}