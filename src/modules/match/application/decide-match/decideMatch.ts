import { MatchRepository } from "../../domain/MatchRepository";

export function decideMatch(matchRepository: MatchRepository) {
  return async (id: number): Promise<void> => {
    await matchRepository.decideMatch(id);
  };
}
