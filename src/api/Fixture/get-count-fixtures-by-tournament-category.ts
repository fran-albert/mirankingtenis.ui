import axiosInstance from "@/services/axiosConfig";

export const getCountFixturesByTournamentCategory = async (idCategory: number, idTournament: number): Promise<number> => {
    const response = await axiosInstance.get(`fixture/getCountFixturesByTournamentCategory/${idCategory}/${idTournament}`);
    return response.data;
}