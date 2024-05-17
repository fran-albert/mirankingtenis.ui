import { Fixture } from "./Fixture";

export interface FixtureRepository {
  createFixture: (newFixture: Fixture) => Promise<Fixture | undefined>;
  getFixtureByCategory(idCategory: number): Promise<Fixture[]>;
  getFixtureByCategoryAndTournament(idCategory: number, idTournament: number): Promise<number>;
  countByCategory(idCategory: number): Promise<number>;
}
