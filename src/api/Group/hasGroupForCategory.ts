import axiosInstance from "@/services/axiosConfig";

export const hasGroupsForCategory = async (idTournament: number, idCategory: number): Promise<boolean> => {
    const response = await axiosInstance.get(`group/has-group/${idTournament}/${idCategory}`);
    return response.data as boolean;
}