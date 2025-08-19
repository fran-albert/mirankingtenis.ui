import axiosInstance from "@/services/axiosConfig";
import { Match } from "@/modules/match/domain/Match";

export async function createSets(sets: Match): Promise<Match> {
    try {
        const response = await axiosInstance.post("sets/matches-with-sets", sets);
        const data = response.data as Match;
        return data;
    } catch (error) {
        console.error("Error creating sets:", error);
        throw error;
    }
}