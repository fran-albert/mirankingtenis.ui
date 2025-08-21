import axiosInstance from "@/services/axiosConfig";
import { FixtureRepository } from "../domain/FixtureRepository";
import { Fixture } from "../domain/Fixture";
import { Match } from "@/types/Match/Match";

export function createApiFixtureRepository(): FixtureRepository {
  async function createFixture(newFixture: Fixture): Promise<Fixture> {
    const response = await axiosInstance.post(`fixture/generate`, newFixture);
    const fixture = response.data as Fixture;
    return fixture;
  }

  async function createFixtureGroup(idTournament: number, idCategory: number): Promise<string> {
    const response = await axiosInstance.post(`fixture/create-fixture-group-master/${idTournament}/${idCategory}`);
    const fixture = response.data as string;
    return fixture;
  }

  async function isGroupStageFixturesCreated(idTournament: number, idCategory: number): Promise<boolean> {
    const response = await axiosInstance.get(`fixture/isGroupStageFixturesCreated/${idTournament}/${idCategory}`);
    return response.data;
  }

  async function getFixtureByCategory(idCategory: number): Promise<Fixture[]> {
    const response = await axiosInstance.get(
      `fixture/by-category/${idCategory}`
    );
    const fixtures = response.data as Fixture[];
    return fixtures;
  }

  async function getFixtureByCategoryAndTournament(idCategory: number, idTournament: number): Promise<number> {
    const response = await axiosInstance.get(
      `fixture/getCountFixturesByTournamentCategory/${idCategory}/${idTournament}`
    );
    const fixtures = response.data;
    return fixtures;
  }

  async function getSemiFinals(idTournament: number, idCategory: number): Promise<Match[]> {
    const response = await axiosInstance.post(`playoff/quarter-finals/${idTournament}/${idCategory}`);
    const fixtures = response.data as Match[];
    return fixtures;
  }
  async function getQuarterFinals(idTournament: number, idCategory: number): Promise<Match[]> {
    const response = await axiosInstance.post(`playoff/semi-finals/${idTournament}/${idCategory}`);
    const fixtures = response.data as Match[];
    return fixtures;
  }

  async function getFinals(idTournament: number, idCategory: number): Promise<Match[]> {
    const response = await axiosInstance.post(`playoff/finals/${idTournament}/${idCategory}`);
    const fixtures = response.data as Match[];
    return fixtures;
  }

  async function createPlayOff(idTournament: number, idCategory: number): Promise<string> {
    const response = await axiosInstance.post(`playoff/create/${idTournament}/${idCategory}`);
    const fixtures = response.data;
    return fixtures;
  }


  async function countByCategory(idCategory: number): Promise<number> {
    const response = await axiosInstance.get(
      `fixture/count-fixtures-by-category/${idCategory}`
    );
    const fixtures = response.data;
    return fixtures;
  }

  return {
    createFixture, getFixtureByCategoryAndTournament, createFixtureGroup, isGroupStageFixturesCreated,
    countByCategory, getFinals, getQuarterFinals, getSemiFinals, createPlayOff,
    getFixtureByCategory,
  };
}
