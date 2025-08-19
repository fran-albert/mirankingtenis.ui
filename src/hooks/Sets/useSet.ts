import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSets } from "@/api/Sets/create-sets.action";
import { getTotalPlayerSetSummary } from "@/api/Sets/get-player-set-summary.action";
import { Match } from "@/types/Match/Match";

// Hook para obtener el resumen de sets de un jugador
export function usePlayerSetSummary(playerId: number, enabled = true) {
  return useQuery({
    queryKey: ["player-set-summary", playerId],
    queryFn: () => getTotalPlayerSetSummary(playerId),
    enabled: !!playerId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Hook para crear sets (mutación)
export function useCreateSets() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sets: Match) => createSets(sets),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas después de crear sets
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["player-set-summary"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
      
      // Si podemos extraer los IDs de los jugadores del match, invalidamos sus resúmenes específicos
      if (variables.idUser1) {
        queryClient.invalidateQueries({ queryKey: ["player-set-summary", variables.idUser1] });
      }
      if (variables.idUser2) {
        queryClient.invalidateQueries({ queryKey: ["player-set-summary", variables.idUser2] });
      }
    },
    onError: (error) => {
      console.error("Error creating sets:", error);
    },
  });
}