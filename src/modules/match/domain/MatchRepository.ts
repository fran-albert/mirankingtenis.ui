import { Match } from "./Match";

export interface MatchRepository {
  getAllMatches: () => Promise<Match[]>;
  getAllByDate: () => Promise<Match[]>;
  getByCategoryAndMatchday: (
    idCategory: number,
    matchDay: number
  ) => Promise<Match[]>;
  getMatchesByUser: (idUser: number) => Promise<Match[]>;
  deleteMatch: (id: number) => Promise<void>;
  decideMatch: (id: number, idUserWinner: number) => Promise<void>;
  getMatchesByTournamentCategoryAndMatchday: (idTournamentCategory: number, matchDay: number) => Promise<any[]>;
  getNextMatch: (idTournament: number, idUser: number) => Promise<any>;
}
