"use client";
import { useQuery } from "@tanstack/react-query";
import { getDoublesEventMatches } from "@/api/Doubles-Event/events";

export const useDoublesEventMatches = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: matches = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-event-matches", eventId],
    queryFn: () => getDoublesEventMatches(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { matches, error, isLoading, isError, isFetching };
};
