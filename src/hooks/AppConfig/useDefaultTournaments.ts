"use client";
import { useQuery } from "@tanstack/react-query";
import { getDefaultTournaments, DefaultTournamentsResponse } from "@/api/AppConfig/get-default-tournaments.action";

export const useDefaultTournaments = (enabled: boolean = true) => {
  const { data, isLoading, isError, error, isFetching } = useQuery<DefaultTournamentsResponse>({
    queryKey: ['default-tournaments'],
    queryFn: getDefaultTournaments,
    staleTime: 1000 * 60 * 10, // 10 minutos - esto no cambia frecuentemente
    enabled,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  return {
    defaults: data,
    isLoading,
    isError,
    error,
    isFetching,
  };
};
