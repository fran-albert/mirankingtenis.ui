"use client";
import { useQuery } from "@tanstack/react-query";
import { getPlayerStats } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventPlayerStats = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: playerStats = [],
  } = useQuery({
    queryKey: teamEventKeys.playerStats(eventId),
    queryFn: () => getPlayerStats(eventId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId,
  });

  return { playerStats, isLoading, isError };
};
