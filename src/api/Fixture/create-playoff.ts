import axiosInstance from "@/services/axiosConfig";

export const createPlayOff = async (idTournament: number, idCategory: number): Promise<string> => {
    const response = await axiosInstance.post(`playoff/create/${idTournament}/${idCategory}`);
    return response.data;
}