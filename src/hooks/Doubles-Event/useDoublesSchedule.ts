"use client";
import { useQuery } from "@tanstack/react-query";
import { getDoublesSchedule } from "@/api/Doubles-Event/schedule";

export const useDoublesSchedule = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: schedule,
    isFetching,
  } = useQuery({
    queryKey: ["doubles-schedule", eventId],
    queryFn: () => getDoublesSchedule(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { schedule, error, isLoading, isError, isFetching };
};
