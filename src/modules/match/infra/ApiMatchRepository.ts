import axiosInstance from "@/services/axiosConfig";
import { MatchRepository } from "../domain/MatchRepository";
import { Match } from "../domain/Match";

export function createApiMatchRepository(): MatchRepository {
  async function getAllMatches(): Promise<Match[]> {
    const response = await axiosInstance.get(`matches`);
    const matches = response.data as Match[];
    return matches;
  }

  return {
    getAllMatches,
  };
}
