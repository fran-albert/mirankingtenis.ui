import { TrophyStatistics, UserTrophyCount, Trophy } from "@/types/Trophy/Trophy";
import axiosInstance from "@/services/axiosConfig";

export const getTrophyStatistics = async (userId: number): Promise<TrophyStatistics> => {
  const response = await axiosInstance.get(`trophy/user/${userId}/statistics`);
  return response.data as TrophyStatistics;
};

export const getGlobalTrophyRanking = async (limit: number = 10): Promise<UserTrophyCount[]> => {
  const response = await axiosInstance.get(`trophy/global-ranking?limit=${limit}`);
  return response.data as UserTrophyCount[];
};

export const getTournamentTrophies = async (tournamentId: number): Promise<Trophy[]> => {
  const response = await axiosInstance.get(`trophy/tournament/${tournamentId}`);
  return response.data as Trophy[];
};