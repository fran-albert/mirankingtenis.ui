"use client";
import { useQuery } from "@tanstack/react-query";
import { getDoublesTeams } from "@/api/Doubles-Event/teams";

export const useDoublesTeams = (categoryId: number, enabled = true) => {
  const { isLoading, isError, error, data: teams = [], isFetching } = useQuery({
    queryKey: ["doubles-teams", categoryId],
    queryFn: () => getDoublesTeams(categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!categoryId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  return { teams, error, isLoading, isError, isFetching };
};
