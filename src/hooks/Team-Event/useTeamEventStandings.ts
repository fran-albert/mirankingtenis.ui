"use client";
import { useQuery } from "@tanstack/react-query";
import { getStandings } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventStandings = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: standings = [],
  } = useQuery({
    queryKey: teamEventKeys.standings(eventId),
    queryFn: () => getStandings(eventId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId,
  });

  return { standings, isLoading, isError };
};
