import axiosInstance from "@/services/axiosConfig";

export const getTotalTournaments = async (): Promise<number> => {
    const response = await axiosInstance.get(`tournament`);
    const tournament = response.data.length;
    return tournament;
}