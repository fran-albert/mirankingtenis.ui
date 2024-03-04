import { Match } from "../../domain/Match";
import { MatchRepository } from "../../domain/MatchRepository";

export function getMatchesByUser(matchRepository: MatchRepository) {
  return async (idUser : number): Promise<Match[]> => {
    return await matchRepository.getMatchesByUser(idUser);
  };
}
