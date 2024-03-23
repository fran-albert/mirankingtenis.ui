import axiosInstance from "@/services/axiosConfig";
import { MatchRepository } from "../domain/MatchRepository";
import { Match } from "../domain/Match";

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

  async function getMatchesByUser(idUser: number): Promise<Match[]> {
    const response = await axiosInstance.get(
      `matches/by-user?idUser=${idUser}`
    );
    const matches = response.data as Match[];
    return matches;
  }

  async function deleteMatch(id: number): Promise<void> {
    const response = await axiosInstance.delete(`matches/${id}`);
    return response.data;
  }
  async function decideMatch(id: number, winnerUserId: number): Promise<void> {
    const response = await axiosInstance.post(`matches/${id}/decide-winner`, {
      winnerUserId,
    });
    return response.data;
  }

  return {
    getAllMatches,
    getByCategoryAndMatchday,
    getMatchesByUser,
    getAllByDate,
    deleteMatch,
    decideMatch,
  };
}
