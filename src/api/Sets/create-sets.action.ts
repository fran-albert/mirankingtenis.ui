import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/types/Match/Match";

export async function createSets(sets: Match) {
    try {
        const response = await axiosInstance.post("sets/matches-with-sets", sets);
        return response; // Return complete response, not just response.data
    } catch (error) {
        console.error("Error creating sets:", error);
        throw error;
    }
}