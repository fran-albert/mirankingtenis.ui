import axiosInstance from "@/services/axiosConfig";

export const deleteTournament = async (idTournament: number): Promise<string> => {
    const response = await axiosInstance.delete(`tournament/${idTournament}`);
    const tournament = response.data as string;
    return tournament;
}