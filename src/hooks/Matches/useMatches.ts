import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMatches } from "@/api/Matches/get-all-matches.action";
import { getAllByDate } from "@/api/Matches/get-matches-by-date.action";
import { getByCategoryAndMatchday } from "@/api/Matches/get-matches-by-category-and-matchday.action";
import { getMatchesByUser } from "@/api/Matches/get-matches-by-user.action";
import { getAllMatchesByUser } from "@/api/Matches/get-all-matches-by-user.action";
import { findMatchesByGroupStage } from "@/api/Matches/find-matches-by-group-stage.action";
import { getMatchesByTournamentCategoryAndMatchday } from "@/api/Matches/get-matches-by-tournament-category-and-matchday.action";
import { getNextMatch } from "@/api/Matches/get-next-match.action";
import { deleteMatch } from "@/api/Matches/delete-match.action";
import { decideMatch } from "@/api/Matches/decide-match.action";

// Hook para obtener todos los partidos
export function useAllMatches(enabled = true) {
  return useQuery({
    queryKey: ["matches", "all"],
    queryFn: () => getAllMatches(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener partidos por fecha
export function useMatchesByDate(enabled = true) {
  return useQuery({
    queryKey: ["matches", "by-date"],
    queryFn: () => getAllByDate(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener partidos por categoría y fecha de partido
export function useMatchesByCategoryAndMatchday(idCategory: number, matchDay: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "by-category-matchday", idCategory, matchDay],
    queryFn: () => getByCategoryAndMatchday(idCategory, matchDay),
    enabled: !!idCategory && !!matchDay && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener partidos de un usuario específico
export function useMatchesByUser(idUser: number, idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "by-user", idUser, idTournament, idCategory],
    queryFn: () => getMatchesByUser(idUser, idTournament, idCategory),
    enabled: !!idUser && !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener todos los partidos de un usuario
export function useAllMatchesByUser(idUser: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "all-by-user", idUser],
    queryFn: () => getAllMatchesByUser(idUser),
    enabled: !!idUser && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener partidos por grupo
export function useMatchesByGroupStage(idGroupStage: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "by-group-stage", idGroupStage],
    queryFn: () => findMatchesByGroupStage(idGroupStage),
    enabled: !!idGroupStage && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener partidos por categoría de torneo y fecha
export function useMatchesByTournamentCategoryAndMatchday(idTournamentCategory: number, matchDay: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "by-tournament-category-matchday", idTournamentCategory, matchDay],
    queryFn: () => getMatchesByTournamentCategoryAndMatchday(idTournamentCategory, matchDay),
    enabled: !!idTournamentCategory && !!matchDay && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener el próximo partido de un usuario
export function useNextMatch(idTournament: number, idUser: number, enabled = true) {
  return useQuery({
    queryKey: ["matches", "next-match", idTournament, idUser],
    queryFn: () => getNextMatch(idTournament, idUser),
    enabled: !!idTournament && !!idUser && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para eliminar partido (mutación)
export function useDeleteMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteMatch(id),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas después de eliminar partido
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
    },
    onError: (error) => {
      console.error("Error deleting match:", error);
    },
  });
}

// Hook para decidir ganador de partido (mutación)
export function useDecideMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { id: number; winnerUserId: number; tournamentCategoryId: number }) => 
      decideMatch(params.id, params.winnerUserId, params.tournamentCategoryId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas después de decidir ganador
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
      queryClient.invalidateQueries({ queryKey: ["quarter-finals"] });
      queryClient.invalidateQueries({ queryKey: ["semifinals"] });
      queryClient.invalidateQueries({ queryKey: ["finals"] });
    },
    onError: (error) => {
      console.error("Error deciding match winner:", error);
    },
  });
}