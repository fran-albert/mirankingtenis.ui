import { Fixture } from "./Fixture";

export interface FixtureRepository {
  createFixture: (newFixture: Fixture) => Promise<Fixture | undefined>;
  createFixtureGroup: (idTournament: number, idCategory: number) => Promise<string>;
  getFixtureByCategory(idCategory: number): Promise<Fixture[]>;
  isGroupStageFixturesCreated(idTournament: number, idCategory: number): Promise<boolean>;
  getFixtureByCategoryAndTournament(idCategory: number, idTournament: number): Promise<number>;
  countByCategory(idCategory: number): Promise<number>;
}
