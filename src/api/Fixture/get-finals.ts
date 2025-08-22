import { Match } from "@/types/Match/Match";
import axiosInstance from "@/services/axiosConfig";

export const getFinals = async (idTournament: number, idCategory: number): Promise<Match[]> => {
    const response = await axiosInstance.post(`playoff/finals/${idTournament}/${idCategory}`);
    const matches = response.data as Match[];
    return matches;
}