import { Ranking } from "./Ranking";

export interface RankingRepository {
  get: () => Promise<Ranking[]>;
  getRankingByCategory: (idCategory: number) => Promise<Ranking[]>;
}
