import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Trophy, TrophyStatistics, TrophyFilters, UserTrophyCount } from "@/types/Trophy/Trophy";
import { getTrophyStatistics, getGlobalTrophyRanking, getTournamentTrophies } from "@/api/Trophy/get-trophy-statistics";
import { countUserTrophies } from "@/api/Trophy/count-user-trophies";
import { getUserTrophies } from "@/api/Trophy/get-user-trophies";

export const useUserTrophies = (
  userId: number,
  filters?: TrophyFilters
): UseQueryResult<Trophy[], Error> => {
  return useQuery({
    queryKey: ['user-trophies', userId, filters],
    queryFn: () => getUserTrophies(userId, filters),
    enabled: !!userId,
  });
};

export const useTrophyStatistics = (
  userId: number
): UseQueryResult<TrophyStatistics, Error> => {
  return useQuery({
    queryKey: ['trophy-statistics', userId],
    queryFn: () => getTrophyStatistics(userId),
    enabled: !!userId,
  });
};

export const useGlobalTrophyRanking = (
  limit: number = 10
): UseQueryResult<UserTrophyCount[], Error> => {
  return useQuery({
    queryKey: ['global-trophy-ranking', limit],
    queryFn: () => getGlobalTrophyRanking(limit),
  });
};

export const useTournamentTrophies = (
  tournamentId: number
): UseQueryResult<Trophy[], Error> => {
  return useQuery({
    queryKey: ['tournament-trophies', tournamentId],
    queryFn: () => getTournamentTrophies(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useUserTrophyCount = (
  userId: number
): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: ['user-trophy-count', userId],
    queryFn: () => countUserTrophies(userId),
    enabled: !!userId,
  });
};