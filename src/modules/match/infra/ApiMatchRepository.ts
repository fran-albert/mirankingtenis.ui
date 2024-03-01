import axiosInstance from "@/services/axiosConfig";
import { MatchRepository } from "../domain/MatchRepository";
import { Match } from "../domain/Match";

export function createApiMatchRepository(): MatchRepository {
  async function getAllMatches(): Promise<Match[]> {
    const response = await axiosInstance.get(`matches`);
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

  async function deleteMatch(id: number): Promise<void> {
    const response = await axiosInstance.delete(`matches/${id}`);
    return response.data;
  }

  return {
    getAllMatches,
    getByCategoryAndMatchday,
    deleteMatch,
  };
}
