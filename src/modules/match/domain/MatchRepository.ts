import { Match } from "./Match";

export interface MatchRepository {
	getAllMatches: () => Promise<Match[]>;
}