import axiosInstance from "@/services/axiosConfig";
import { ManualBracketRequest } from "@/types/Tournament-Category/TournamentCategory";

export interface ManualBracketResponse {
    playoffStageId: number;
    round: string;
    matchesCreated: number;
    matches: any[];
}

export const createManualBracket = async (
    data: ManualBracketRequest
): Promise<ManualBracketResponse> => {
    const response = await axiosInstance.post('playoff/create-manual', data);
    return response.data as ManualBracketResponse;
};
