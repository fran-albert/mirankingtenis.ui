"use client";
import { useQuery } from "@tanstack/react-query";
import { getDoublesTurns } from "@/api/Doubles-Event/turns";

export const useDoublesTurns = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: turns = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-turns", eventId],
    queryFn: () => getDoublesTurns(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { turns, error, isLoading, isError, isFetching };
};
