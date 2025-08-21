import axiosInstance from "@/services/axiosConfig";

export const startTournament = async (idTournament: number): Promise<any[]> => {
    const response = await axiosInstance.post(`tournament/start/${idTournament}`);
    const tournament = response.data as any[];
    return tournament;
}