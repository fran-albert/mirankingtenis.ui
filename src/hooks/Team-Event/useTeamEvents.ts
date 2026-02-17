"use client";
import { useQuery } from "@tanstack/react-query";
import { getAllTeamEvents, getTeamEvent } from "@/api/Team-Event/events";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEvents = () => {
  const {
    isLoading,
    isError,
    data: events = [],
  } = useQuery({
    queryKey: teamEventKeys.all,
    queryFn: getAllTeamEvents,
    staleTime: 1000 * 60 * 5,
  });

  return { events, isLoading, isError };
};

export const useTeamEvent = (id: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: event,
  } = useQuery({
    queryKey: teamEventKeys.detail(id),
    queryFn: () => getTeamEvent(id),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!id,
  });

  return { event, isLoading, isError };
};
