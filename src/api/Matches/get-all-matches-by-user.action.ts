import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function getAllMatchesByUser(idUser: number): Promise<Match[]> {
    try {
        const response = await axiosInstance.get(`matches/all-matches-by-user/${idUser}`);
        const matches = response.data as Match[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for this user.");
            return [];
        }
        console.error("Error fetching all matches by user:", error);
        throw error;
    }
}