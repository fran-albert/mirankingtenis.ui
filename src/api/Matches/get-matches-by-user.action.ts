import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function getMatchesByUser(idUser: number, idTournament: number, idCategory: number): Promise<Match[]> {
    try {
        const response = await axiosInstance.get(
            `matches/by-user/${idUser}/tournament/${idTournament}/category/${idCategory}`
        );
        const matches = response.data as Match[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for this user in this tournament/category.");
            return [];
        }
        console.error("Error fetching matches by user:", error);
        throw error;
    }
}