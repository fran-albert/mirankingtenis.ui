import axiosInstance from "@/services/axiosConfig";
import { GroupRepository } from "../domain/GroupRepository";
import { GroupDto, GroupRankingDto } from "@/common/types/group-ranking.dto";

export function createApiGroupRepository(): GroupRepository {

    async function findAllByGroupStage(groupStageId: number,): Promise<GroupDto[]> {
        const response = await axiosInstance.get(`group/by-group-stage/${groupStageId}`);
        const tournament = response.data as GroupDto[];
        return tournament;
    }

    async function hasGroupsForCategory(idTournament: number, idCategory: number): Promise<boolean> {
        const response = await axiosInstance.get(`group/has-group/${idTournament}/${idCategory}`);
        return response.data as boolean;
    }

    async function getGroupRankings(groupStageId: number): Promise<GroupRankingDto[]> {
        const response = await axiosInstance.get(`group/rankings/${groupStageId}`);
        const tournament = response.data as GroupRankingDto[];
        return tournament;
    }

    return {
        findAllByGroupStage, getGroupRankings,hasGroupsForCategory
    };
}
