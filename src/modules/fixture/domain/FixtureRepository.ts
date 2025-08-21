import { Match } from "@/types/Match/Match";
import { Fixture } from "./Fixture";

export interface FixtureRepository {
  createFixture: (newFixture: Fixture) => Promise<Fixture | undefined>;
  createFixtureGroup: (idTournament: number, idCategory: number) => Promise<string>;
  getFixtureByCategory(idCategory: number): Promise<Fixture[]>;
  isGroupStageFixturesCreated(idTournament: number, idCategory: number): Promise<boolean>;
  getFixtureByCategoryAndTournament(idCategory: number, idTournament: number): Promise<number>;
  getSemiFinals(idCategory: number, idTournament: number): Promise<Match[]>;
  getQuarterFinals(idCategory: number, idTournament: number): Promise<Match[]>;
  createPlayOff(idCategory: number, idTournament: number): Promise<string>;
  getFinals(idCategory: number, idTournament: number): Promise<Match[]>;
  countByCategory(idCategory: number): Promise<number>;
}
