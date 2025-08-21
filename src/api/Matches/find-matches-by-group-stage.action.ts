import axiosInstance from "@/services/axiosConfig";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export async function findMatchesByGroupStage(idGroupStage: number): Promise<GroupFixtureDto[]> {
    try {
        const response = await axiosInstance.get(`matches/group-stage/${idGroupStage}`);
        const matches = response.data as GroupFixtureDto[];
        return matches;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for this group stage.");
            return [];
        }
        console.error("Error fetching matches by group stage:", error);
        throw error;
    }
}