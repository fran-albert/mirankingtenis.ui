import axiosInstance from "@/services/axiosConfig";
import { PlayOffRepository } from "../domain/PlayOffRepository";
import { ResponsePlayOffDto } from "../domain/PlayOff";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export function createApiPlayOffRepository(): PlayOffRepository {
    async function getQuarterFinals(idTournament: number, idCategory: number): Promise<GroupFixtureDto[]> {
        try {
            const response = await axiosInstance.get(`playoff/quarter-finals/${idTournament}/${idCategory}`);
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


    async function getSemifinals(idTournament: number, idCategory: number): Promise<GroupFixtureDto[]> {
        const response = await axiosInstance.get(`playoff/semi-finals/${idTournament}/${idCategory}`);
        const data = response.data as GroupFixtureDto[];
        return data;
    }

    async function getFinals(idTournament: number, idCategory: number): Promise<GroupFixtureDto[]> {
        const response = await axiosInstance.get(`playoff/finals/${idTournament}/${idCategory}`);
        const data = response.data as GroupFixtureDto[];
        return data;
    }

    return {
        getFinals, getQuarterFinals, getSemifinals
    };
}
