import axiosInstance from "@/services/axiosConfig";
import { FixtureRepository } from "../domain/FixtureRepository";
import { Fixture } from "../domain/Fixture";

export function createApiFixtureRepository(): FixtureRepository {
  async function createFixture(newFixture: Fixture): Promise<Fixture> {
    const response = await axiosInstance.post(`fixture/generate`, newFixture);
    const fixture = response.data as Fixture;
    return fixture;
  }

  async function getFixtureByCategory(idCategory: number): Promise<Fixture[]> {
    const response = await axiosInstance.get(
      `fixture/by-category/${idCategory}`
    );
    const fixtures = response.data as Fixture[];
    return fixtures;
  }

  return {
    createFixture,
    getFixtureByCategory,
  };
}
