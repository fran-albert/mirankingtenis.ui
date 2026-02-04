"use client";
import { useQuery } from "@tanstack/react-query";
import { getDoublesCategories } from "@/api/Doubles-Event/categories";

export const useDoublesCategories = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    error,
    data: categories = [],
    isFetching,
  } = useQuery({
    queryKey: ["doubles-categories", eventId],
    queryFn: () => getDoublesCategories(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { categories, error, isLoading, isError, isFetching };
};
