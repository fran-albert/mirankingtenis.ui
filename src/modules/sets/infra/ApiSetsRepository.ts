import axiosInstance from "@/services/axiosConfig";
import { SetsRepository } from "../domain/SetRepository";
import { Sets } from "../domain/Sets";
import { Match } from "@/modules/match/domain/Match";
import { SetSummaryDto } from "@/common/types/set-summary.dto";

export function createApiSetsRepository(): SetsRepository {
  async function createSets(sets: Match): Promise<Match> {
    const response = await axiosInstance.post("sets/matches-with-sets", sets);
    const data = response.data as Match;
    return data;
  }

  async function getTotalPlayerSetSummary(playerId: number): Promise<SetSummaryDto> {
    const response = await axiosInstance.get(`sets/players/${playerId}/set-summary`);
    const data = response.data as SetSummaryDto;
    return data;
  }

  return {
    createSets, getTotalPlayerSetSummary
  };
}
