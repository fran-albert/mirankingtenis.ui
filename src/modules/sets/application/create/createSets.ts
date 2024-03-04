import { Match } from "@/modules/match/domain/Match";
import { SetsRepository } from "../../domain/SetRepository";

export function createSets(setRepository: SetsRepository) {
  return async (sets: Match): Promise<Match | undefined> => {
    return await setRepository.createSets(sets);
  };
}
