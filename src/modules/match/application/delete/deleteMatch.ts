import { MatchRepository } from "../../domain/MatchRepository";

export function deleteMatch(matchRepository: MatchRepository) {
  return async (id: number): Promise<void> => {
    await matchRepository.deleteMatch(id);
  };
}
