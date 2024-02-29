import { Fixture } from "./Fixture";

export interface FixtureRepository {
    createFixture: (newFixture: Fixture) => Promise<Fixture | undefined>;
}
