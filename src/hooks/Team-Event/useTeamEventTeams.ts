"use client";
import { useQuery } from "@tanstack/react-query";
import { getTeamsByEvent } from "@/api/Team-Event/teams";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventTeams = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: teams = [],
  } = useQuery({
    queryKey: teamEventKeys.teams(eventId),
    queryFn: () => getTeamsByEvent(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
  });

  return { teams, isLoading, isError };
};
