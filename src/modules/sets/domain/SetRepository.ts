import { Match } from "@/modules/match/domain/Match";

export interface SetsRepository {
  createSets: (sets: Match) => Promise<Match | undefined>;
}
