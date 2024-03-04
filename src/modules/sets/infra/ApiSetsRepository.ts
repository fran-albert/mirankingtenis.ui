import axiosInstance from "@/services/axiosConfig";
import { SetsRepository } from "../domain/SetRepository";
import { Sets } from "../domain/Sets";
import { Match } from "@/modules/match/domain/Match";

export function createApiSetsRepository(): SetsRepository {
  async function createSets(sets: Match): Promise<Match> {
    const response = await axiosInstance.post("sets/matches-with-sets", sets);
    const data = response.data as Match;
    return data;
  }

  return {
    createSets,
  };
}
