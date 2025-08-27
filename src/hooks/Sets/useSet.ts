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
    retry: (failureCount, error: any) => {
      // Retry en 409 hasta 3 veces
      if (error?.response?.status === 409 && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    onSuccess: (response, variables) => {
      // Check if idempotent response
      const isIdempotent = response.headers?.['x-idempotent'] === 'true';
      if (isIdempotent) {
        console.log('Resultado obtenido del cache');
      }
      
      // Log the created sets for debugging
      if (response.data) {
        console.log('Sets creados:', response.data);
      }
      
      // Invalidate queries - use predicate to match all matches-related queries
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === "matches";
        }
      });
      queryClient.invalidateQueries({ queryKey: ["player-set-summary"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-ranking"] });
      
      // Invalidate tournament ranking history for the chart
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === "tournament-ranking-history";
        }
      });
      
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