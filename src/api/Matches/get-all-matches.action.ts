import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function getAllMatches(): Promise<Match[]> {
    try {
        const response = await axiosInstance.get(`matches`);
        const matches = response.data as Match[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found.");
            return [];
        }
        console.error("Error fetching all matches:", error);
        throw error;
    }
}