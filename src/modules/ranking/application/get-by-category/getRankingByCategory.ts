import { Ranking } from "../../domain/Ranking";
import { RankingRepository } from "../../domain/RankingRepository";

export function getRankingByCategory(rankingRepository: RankingRepository) {
  return async (idCategory: number): Promise<Ranking[]> => {
    return await rankingRepository.getRankingByCategory(idCategory);
  };
}
