import { MatchRepository } from "../../domain/MatchRepository";

export function decideMatch(matchRepository: MatchRepository) {
  return async (id: number, idUserWinner: number, tournament: number): Promise<void> => {
    await matchRepository.decideMatch(id, idUserWinner, tournament);
  };
}
