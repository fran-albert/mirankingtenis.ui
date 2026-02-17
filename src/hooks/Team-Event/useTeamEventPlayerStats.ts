"use client";
import { useQuery } from "@tanstack/react-query";
import { getPlayerStats } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventPlayerStats = (
  eventId: number,
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: playerStats = [],
  } = useQuery({
    queryKey: teamEventKeys.playerStats(eventId, categoryId),
    queryFn: () => getPlayerStats(eventId, categoryId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId && !!categoryId,
  });

  return { playerStats, isLoading, isError };
};
