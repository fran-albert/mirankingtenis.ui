import axiosInstance from "@/services/axiosConfig";
import { MatchRepository } from "../domain/MatchRepository";
import { Match } from "../domain/Match";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";

export function createApiMatchRepository(): MatchRepository {
  async function getAllMatches(): Promise<Match[]> {
    const response = await axiosInstance.get(`matches`);
    const matches = response.data as Match[];
    return matches;
  }
  async function getAllByDate(): Promise<Match[]> {
    const response = await axiosInstance.get(`matches/by-date`);
    const matches = response.data as Match[];
    return matches;
  }

  async function getByCategoryAndMatchday(
    idCategory: number,
    matchDay: number
  ): Promise<Match[]> {
    const response = await axiosInstance.get(
      `matches/by-category-and-matchday?idCategory=${idCategory}&matchday=${matchDay}`
    );
    const matches = response.data as Match[];
    return matches;
  }

  async function getMatchesByUser(idUser: number, idTournament: number, idCategory: number): Promise<Match[]> {
    const response = await axiosInstance.get(
      `matches/by-user/${idUser}/tournament/${idTournament}/category/${idCategory}`
    );
    const matches = response.data as Match[];
    return matches;
  }

  async function getAllMatchesByUser(idUser: number): Promise<Match[]> {
    const response = await axiosInstance.get(
      `matches/all-matches-by-user/${idUser}`
    );
    const matches = response.data as Match[];
    return matches;
  }

  async function findMatchesByGroupStage(idGroupStage: number): Promise<GroupFixtureDto[]> {
    const response = await axiosInstance.get(
      `matches/group-stage/${idGroupStage}`
    );
    const matches = response.data as GroupFixtureDto[];
    return matches;
  }

  async function getMatchesByTournamentCategoryAndMatchday(idTournamentCategory: number, matchDay: number): Promise<any[]> {
    const response = await axiosInstance.get(
      `matches/tournament-category/${idTournamentCategory}/matchday/${matchDay}`
    );
    return response.data;
  }

  async function getNextMatch(idTournament: number, idUser: number): Promise<any> {
    const response = await axiosInstance.get(
      `matches/${idTournament}/players/${idUser}/next-match`
    );
    return response.data;
  }


  async function deleteMatch(id: number): Promise<void> {
    const response = await axiosInstance.delete(`matches/${id}`);
    return response.data;
  }
  async function decideMatch(id: number, winnerUserId: number, tournamentCategoryId: number): Promise<void> {
    const response = await axiosInstance.post(`matches/${id}/decide-winner`, {
      winnerUserId, tournamentCategoryId
    });
    return response.data;
  }

  return {
    getAllMatches,
    getByCategoryAndMatchday,
    getMatchesByUser,
    getAllByDate, findMatchesByGroupStage,
    deleteMatch, getMatchesByTournamentCategoryAndMatchday, getAllMatchesByUser,
    decideMatch, getNextMatch
  };
}
