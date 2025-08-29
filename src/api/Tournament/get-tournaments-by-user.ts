import axiosInstance from "@/services/axiosConfig";

export const getTournamentsByUser = async (userId: number): Promise<number> => {
    const response = await axiosInstance.get(`tournament/players/${userId}/tournaments`);
    return response.data.length;
};