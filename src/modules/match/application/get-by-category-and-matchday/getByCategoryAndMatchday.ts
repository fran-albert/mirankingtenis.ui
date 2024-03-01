import { Match } from "../../domain/Match";
import { MatchRepository } from "../../domain/MatchRepository";

export function getByCategoryAndMatchday(matchRepository: MatchRepository) {
  return async (idCategory : number , matchDay: number): Promise<Match[]> => {
    return await matchRepository.getByCategoryAndMatchday(idCategory, matchDay);
  };
}
