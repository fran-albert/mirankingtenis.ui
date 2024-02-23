import { Ranking } from "../../domain/Ranking";
import { RankingRepository } from "../../domain/RankingRepository";

export function get(rankingRepository: RankingRepository) {
  return async (): Promise<Ranking[]> => {
    return await rankingRepository.get();
  };
}
