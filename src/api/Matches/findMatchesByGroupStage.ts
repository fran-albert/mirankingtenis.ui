import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import axiosInstance from "@/services/axiosConfig";

export const findMatchesByGroupStage = async (idGroupStage: number): Promise<GroupFixtureDto[]> => {
    const response = await axiosInstance.get(
        `matches/group-stage/${idGroupStage}`
    );
    const matches = response.data as GroupFixtureDto[];
    return matches;
}
