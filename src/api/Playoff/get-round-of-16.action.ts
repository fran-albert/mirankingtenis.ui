import axiosInstance from "@/services/axiosConfig";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export async function getRoundOf16(
    idTournament: number,
    idCategory: number
): Promise<GroupFixtureDto[]> {
    try {
        const response = await axiosInstance.get(
            `playoff/round-of-16/${idTournament}/${idCategory}`
        );
        return response.data as GroupFixtureDto[];
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return [];
        }
        throw error;
    }
}
