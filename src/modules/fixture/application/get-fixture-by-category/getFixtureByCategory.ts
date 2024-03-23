import { Fixture } from "../../domain/Fixture";
import { FixtureRepository } from "../../domain/FixtureRepository";

export function getFixtureByCategory(fixtureRepository: FixtureRepository) {
  return async (idCategory: number): Promise<Fixture[]> => {
    return await fixtureRepository.getFixtureByCategory(idCategory);
  };
}
