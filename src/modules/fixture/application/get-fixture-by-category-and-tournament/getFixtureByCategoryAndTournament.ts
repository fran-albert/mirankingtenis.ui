import { Fixture } from "../../domain/Fixture";
import { FixtureRepository } from "../../domain/FixtureRepository";

export function getFixtureByCategoryAndTournament(fixtureRepository: FixtureRepository) {
    return async (idCategory: number, idTournament: number): Promise<number> => {
        return await fixtureRepository.getFixtureByCategoryAndTournament(idCategory, idTournament);
    };
}
