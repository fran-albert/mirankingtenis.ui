import { Match } from "./Match";

export interface MatchRepository {
	getAllMatches: () => Promise<Match[]>;
	getByCategoryAndMatchday: (idCategory: number, matchDay: number) => Promise<Match[]>;
	getMatchesByUser: (idUser: number) => Promise<Match[]>;
	deleteMatch: (id: number) => Promise<void>;
}