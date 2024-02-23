import axiosInstance from "@/services/axiosConfig";
import axios from "axios";
import { RankingRepository } from "../domain/RankingRepository";
import { Ranking } from "../domain/Ranking";

export function createApiRankingRepositroy(): RankingRepository {
  async function get(): Promise<Ranking[]> {
    const response = await axiosInstance.get(`ranking`);
    const ranking = response.data as Ranking[];
    return ranking;
  }

  return {
    get,
  };
}
