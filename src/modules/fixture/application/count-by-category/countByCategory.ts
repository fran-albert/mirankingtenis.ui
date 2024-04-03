import { FixtureRepository } from "../../domain/FixtureRepository";

export function countByCategory(fixtureRepository: FixtureRepository) {
  return async (idCategory: number): Promise<number> => {
    return await fixtureRepository.countByCategory(idCategory);
  };
}
