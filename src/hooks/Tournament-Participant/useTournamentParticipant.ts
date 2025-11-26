import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayersByTournament } from "@/api/Tournament-Participant/get-players-by-tournament.action";
import { getParticipantsByTournamentCategory } from "@/api/Tournament-Participant/get-participants-by-tournament-category.action";
import { findNonParticipants } from "@/api/Tournament-Participant/find-non-participants.action";
import { hasPlayersForCategory } from "@/api/Tournament-Participant/has-players-for-category.action";
import { desactivatePlayer } from "@/api/Tournament-Participant/desactivate-player.action";
import { createParticipantsForTournament } from "@/api/Tournament-Participant/create-participants-for-tournament.action";

// Hook para obtener jugadores por torneo
export function usePlayersByTournament(idTournament: number, enabled = true) {
  return useQuery({
    queryKey: ["players-by-tournament", idTournament],
    queryFn: () => getPlayersByTournament(idTournament),
    enabled: !!idTournament && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener participantes por torneo y categoría
export function useParticipantsByTournamentCategory(idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["participants-by-tournament-category", idTournament, idCategory],
    queryFn: () => getParticipantsByTournamentCategory(idTournament, idCategory),
    enabled: !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para obtener no participantes
export function useNonParticipants(idTournament: number, enabled = true) {
  return useQuery({
    queryKey: ["non-participants", idTournament],
    queryFn: () => findNonParticipants(idTournament),
    enabled: !!idTournament && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para verificar si hay jugadores para una categoría
export function useHasPlayersForCategory(idTournament: number, idCategory: number, enabled = true) {
  return useQuery({
    queryKey: ["has-players-for-category", idTournament, idCategory],
    queryFn: () => hasPlayersForCategory(idTournament, idCategory),
    enabled: !!idTournament && !!idCategory && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para desactivar jugador (mutación)
export function useDesactivatePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ idPlayer, tournamentId }: { idPlayer: number; tournamentId: number }) => 
      desactivatePlayer(idPlayer, tournamentId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas después de desactivar jugador
      queryClient.invalidateQueries({ queryKey: ["players-by-tournament", variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["participants-by-tournament-category"] });
      queryClient.invalidateQueries({ queryKey: ["non-participants", variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["has-players-for-category"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
    },
    onError: (error) => {
      console.error("Error deactivating player:", error);
    },
  });
}

// Hook para crear participantes para torneo (mutación)
export function useCreateParticipantsForTournament() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      idTournament: number;
      idCategory: number;
      userIds: number[];
      positionInitials: (number | null)[] | null;
      directToPlayoffsFlags: boolean[];
    }) => createParticipantsForTournament(
      params.idTournament,
      params.idCategory,
      params.userIds,
      params.positionInitials,
      params.directToPlayoffsFlags
    ),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas después de crear participantes
      queryClient.invalidateQueries({ queryKey: ["players-by-tournament", variables.idTournament] });
      queryClient.invalidateQueries({ queryKey: ["participants-by-tournament-category", variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ["non-participants", variables.idTournament] });
      queryClient.invalidateQueries({ queryKey: ["has-players-for-category", variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
    },
    onError: (error) => {
      console.error("Error creating participants for tournament:", error);
    },
  });
}