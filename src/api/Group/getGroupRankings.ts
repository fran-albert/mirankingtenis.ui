import { GroupRankingDto } from "@/common/types/group-ranking.dto";
import axiosInstance from "@/services/axiosConfig";

export const getGroupRankings = async (groupStageId: number): Promise<GroupRankingDto[]> => {
    const response = await axiosInstance.get(`group/rankings/${groupStageId}`);
    const tournament = response.data as GroupRankingDto[];
    return tournament;
}
