import { SetSummaryDto } from "@/common/types/set-summary.dto";
import { Match } from "@/modules/match/domain/Match";

export interface SetsRepository {
  createSets: (sets: Match) => Promise<Match | undefined>;
  getTotalPlayerSetSummary: (playerId: number) => Promise<SetSummaryDto>;
}
