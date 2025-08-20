import axiosInstance from "@/services/axiosConfig";
import { MatchByUserResponseDto } from "@/types/Match/MatchByUser.dto";

export async function getMatchesByUser(idUser: number, idTournament: number, idCategory: number): Promise<MatchByUserResponseDto[]> {
    try {
        const response = await axiosInstance.get(
            `matches/by-user/${idUser}/tournament/${idTournament}/category/${idCategory}`
        );
        const matches = response.data as MatchByUserResponseDto[];
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