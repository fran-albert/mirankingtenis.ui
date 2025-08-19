import axiosInstance from "@/services/axiosConfig";

export const isCurrentTournament = async (idTournament: number): Promise<boolean> => {
    const response = await axiosInstance.get(`tournament/${idTournament}/is-current`);
    const tournament = response.data as boolean;
    return tournament;
}