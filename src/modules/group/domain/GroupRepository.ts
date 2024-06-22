import { GroupDto, GroupRankingDto } from "@/common/types/group-ranking.dto";

export interface GroupRepository {
    findAllByGroupStage(groupStageId: number): Promise<GroupDto[]>;
    hasGroupsForCategory(idTournament: number, idCategory: number): Promise<boolean>;
    getGroupRankings(groupStageId: number): Promise<GroupRankingDto[]>;
}