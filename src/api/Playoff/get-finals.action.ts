import axiosInstance from "@/services/axiosConfig";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export async function getFinals(idTournament: number, idCategory: number): Promise<GroupFixtureDto[]> {
    try {
        const response = await axiosInstance.get(`playoff/finals/${idTournament}/${idCategory}`);
        const data = response.data as GroupFixtureDto[];
        return data;
    } catch (error: any) {
        if (error?.response && error.response.status === 404) {
            console.error("No data found for the given tournament and category.");
            return [];
        }
        throw error;
    }
}