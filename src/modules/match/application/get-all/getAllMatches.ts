import { Match } from "../../domain/Match";
import { MatchRepository } from "../../domain/MatchRepository";

export function getAllMatches(matchRepository: MatchRepository) {
  return async (): Promise<Match[]> => {
    return await matchRepository.getAllMatches();
  };
}
