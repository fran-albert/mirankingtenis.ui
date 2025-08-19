import { getFinals } from "@/api/Playoff/get-finals.action";
import { getQuarterFinals } from "@/api/Playoff/get-quarter-finals.action";
import { getSemifinals } from "@/api/Playoff/get-semifinals.action";
import { useQuery } from "@tanstack/react-query";


export function useQuarterFinals(idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["quarter-finals", idTournament, idCategory],
    queryFn: () => getQuarterFinals(idTournament, idCategory),
    enabled: !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

export function useSemifinals(idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["semifinals", idTournament, idCategory],
    queryFn: () => getSemifinals(idTournament, idCategory),
    enabled: !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

export function useFinals(idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["finals", idTournament, idCategory],
    queryFn: () => getFinals(idTournament, idCategory),
    enabled: !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}