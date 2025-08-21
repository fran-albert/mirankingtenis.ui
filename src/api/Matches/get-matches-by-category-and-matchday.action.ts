import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function getByCategoryAndMatchday(idCategory: number, matchDay: number): Promise<Match[]> {
    try {
        const response = await axiosInstance.get(
            `matches/by-category-and-matchday?idCategory=${idCategory}&matchday=${matchDay}`
        );
        const matches = response.data as Match[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for this category and matchday.");
            return [];
        }
        console.error("Error fetching matches by category and matchday:", error);
        throw error;
    }
}