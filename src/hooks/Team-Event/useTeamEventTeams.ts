"use client";
import { useQuery } from "@tanstack/react-query";
import { getTeamsByCategory } from "@/api/Team-Event/teams";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventTeams = (
  eventId: number,
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: teams = [],
  } = useQuery({
    queryKey: teamEventKeys.teams(eventId, categoryId),
    queryFn: () => getTeamsByCategory(eventId, categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId && !!categoryId,
  });

  return { teams, isLoading, isError };
};
