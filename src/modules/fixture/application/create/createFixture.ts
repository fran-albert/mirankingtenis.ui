import { Fixture } from "../../domain/Fixture";
import { FixtureRepository } from "../../domain/FixtureRepository";

export function createFixture(fixtureRepository: FixtureRepository) {
  return async (newFixture: Fixture): Promise<Fixture | undefined> => {
    return await fixtureRepository.createFixture(newFixture);
  };
}
