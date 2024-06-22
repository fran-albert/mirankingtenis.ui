import axiosInstance from "@/services/axiosConfig";
import { GroupStageRepository } from "../domain/GroupStageRepository";

export function createApiGroupStageRepository(): GroupStageRepository {

    async function getGroupStagesByTournamentCategory(idTournament: number, idCategory: number): Promise<number> {
        const response = await axiosInstance.get(`group-stage/tournament-category/${idTournament}/${idCategory}`);
        const tournament = response.data as number;
        return tournament;
    }

    return {
        getGroupStagesByTournamentCategory
    };
}
