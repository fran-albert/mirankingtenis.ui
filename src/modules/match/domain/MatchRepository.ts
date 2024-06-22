import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import { Match } from "./Match";

export interface MatchRepository {
  getAllMatches: () => Promise<Match[]>;
  getAllByDate: () => Promise<Match[]>;
  getByCategoryAndMatchday: (
    idCategory: number,
    matchDay: number
  ) => Promise<Match[]>;
  findMatchesByGroupStage: (idGroupStage: number) => Promise<GroupFixtureDto[]>;
  getMatchesByUser: (idUser: number, idTournament: number, idCategory: number) => Promise<Match[]>;
  getAllMatchesByUser: (idUser: number) => Promise<Match[]>;
  deleteMatch: (id: number) => Promise<void>;
  decideMatch: (id: number, idUserWinner: number) => Promise<void>;
  getMatchesByTournamentCategoryAndMatchday: (idTournamentCategory: number, matchDay: number) => Promise<any[]>;
  getNextMatch: (idTournament: number, idUser: number) => Promise<any>;
}
