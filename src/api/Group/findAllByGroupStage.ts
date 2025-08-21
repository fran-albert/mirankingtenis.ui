import { GroupDto } from "@/common/types/group-ranking.dto";
import axiosInstance from "@/services/axiosConfig";

export const findAllByGroupStage = async (groupStageId: number): Promise<GroupDto[]> => {
    const response = await axiosInstance.get(`group/by-group-stage/${groupStageId}`);
    const tournament = response.data as GroupDto[];
    return tournament;
}