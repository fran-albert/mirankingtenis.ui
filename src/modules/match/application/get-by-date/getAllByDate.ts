import { Match } from "../../domain/Match";
import { MatchRepository } from "../../domain/MatchRepository";

export function getAllByDate(matchRepository: MatchRepository) {
  return async (): Promise<Match[]> => {
    return await matchRepository.getAllByDate();
  };
}
