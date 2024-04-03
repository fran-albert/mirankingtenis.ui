import { Fixture } from "./Fixture";

export interface FixtureRepository {
  createFixture: (newFixture: Fixture) => Promise<Fixture | undefined>;
  getFixtureByCategory(idCategory: number): Promise<Fixture[]>;
  countByCategory(idCategory: number): Promise<number>;
}
