import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function getAllByDate(): Promise<Match[]> {
    try {
        const response = await axiosInstance.get(`matches/by-date`);
        const matches = response.data as Match[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for today.");
            return [];
        }
        console.error("Error fetching matches by date:", error);
        throw error;
    }
}