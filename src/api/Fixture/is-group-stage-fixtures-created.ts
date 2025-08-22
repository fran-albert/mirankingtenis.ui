import axiosInstance from "@/services/axiosConfig";

export const isGroupStageFixturesCreated = async (idTournament: number, idCategory: number): Promise<boolean> => {
    const response = await axiosInstance.get(`fixture/isGroupStageFixturesCreated/${idTournament}/${idCategory}`);
    return response.data;
}