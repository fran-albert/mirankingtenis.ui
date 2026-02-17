"use client";
import { useQuery } from "@tanstack/react-query";
import { getStandings } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventStandings = (
  eventId: number,
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: standings = [],
  } = useQuery({
    queryKey: teamEventKeys.standings(eventId, categoryId),
    queryFn: () => getStandings(eventId, categoryId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId && !!categoryId,
  });

  return { standings, isLoading, isError };
};
