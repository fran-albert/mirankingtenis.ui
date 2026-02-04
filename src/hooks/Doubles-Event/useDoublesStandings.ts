"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getDoublesStandingsByCategory,
  getDoublesStandingsByEvent,
} from "@/api/Doubles-Event/standings";

export const useDoublesStandings = (categoryId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: standings = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-standings", categoryId],
    queryFn: () => getDoublesStandingsByCategory(categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!categoryId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { standings, error, isLoading, isError, isFetching };
};

export const useDoublesEventStandings = (
  eventId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    error,
    data: allStandings = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-standings", "event", eventId],
    queryFn: () => getDoublesStandingsByEvent(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { allStandings, error, isLoading, isError, isFetching };
};
