import { Match } from "../../domain/Match";
import { MatchRepository } from "../../domain/MatchRepository";

export function getMatchesByUser(matchRepository: MatchRepository) {
  return async (idUser: number, idTournament: number, idCategory: number): Promise<Match[]> => {
    return await matchRepository.getMatchesByUser(idUser, idTournament, idCategory);
  };
}
