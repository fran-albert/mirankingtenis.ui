import axiosInstance from "@/services/axiosConfig";

export const finishTournament = async (idTournament: number): Promise<any[]> => {
    const response = await axiosInstance.post(`tournament/finish/${idTournament}`);
    const tournament = response.data as any[];
    return tournament;
}