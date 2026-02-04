"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getAllDoublesEvents,
  getDoublesEvent,
} from "@/api/Doubles-Event/events";

export const useDoublesEvents = () => {
  const { isLoading, isError, error, data: events = [], isFetching } = useQuery({
    queryKey: ["doubles-events"],
    queryFn: getAllDoublesEvents,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { events, error, isLoading, isError, isFetching };
};

export const useDoublesEvent = (id: number, enabled = true) => {
  const { isLoading, isError, error, data: event, isFetching } = useQuery({
    queryKey: ["doubles-event", id],
    queryFn: () => getDoublesEvent(id),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!id,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { event, error, isLoading, isError, isFetching };
};
