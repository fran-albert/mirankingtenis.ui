"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getDoublesMatches,
  getDoublesZoneMatches,
  getDoublesPlayoffMatches,
} from "@/api/Doubles-Event/matches";

export const useDoublesMatches = (categoryId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: matches = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-matches", categoryId],
    queryFn: () => getDoublesMatches(categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!categoryId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { matches, error, isLoading, isError, isFetching };
};

export const useDoublesZoneMatches = (
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    error,
    data: matches = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-matches", categoryId, "zone"],
    queryFn: () => getDoublesZoneMatches(categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!categoryId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { matches, error, isLoading, isError, isFetching };
};

export const useDoublesPlayoffMatches = (
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    error,
    data: matches = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-matches", categoryId, "playoff"],
    queryFn: () => getDoublesPlayoffMatches(categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!categoryId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { matches, error, isLoading, isError, isFetching };
};
