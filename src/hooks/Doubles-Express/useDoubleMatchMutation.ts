import { addPlayerToDoublesMatch } from "@/api/Doubles-Express/addPlayersToDoublesMatch";
import { create } from "@/api/Doubles-Express/create";
import { IRegisterPlayer, registerPlayerToMatch } from "@/api/Doubles-Express/registerPlayerToMatch";
import { removePlayerMatch } from "@/api/Doubles-Express/removePlayerMatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";


export const useDoubleMatchMutations = () => {
  const queryClient = useQueryClient();

  const addDoublesMatchesMutation = useMutation({
    mutationFn: create,
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['doublesMatches'] });
      console.log("doublesMatches created", doublesMatches, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log("Error details:", error.response?.data || error.message, variables, context);
    },
  });

  const addPlayerToDoublesMatchesMutation = useMutation({
    mutationFn: ({ matchId, players }: { matchId: number; players: any }) =>
      addPlayerToDoublesMatch(matchId, players),

    onSuccess: (updatedMatch, variables) => {
      if (!variables?.matchId) {
        console.error("Error: matchId no está definido en variables.");
        return;
      }

      // 🔥 ACTUALIZAR LA CACHÉ DE REACT QUERY
      queryClient.setQueryData(["doubleMatch", variables.matchId], updatedMatch);

      // 🔄 Invalidar la lista global de partidos
      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });

      // 🔄 Refetchear manualmente los datos
      queryClient.refetchQueries({ queryKey: ["doubleMatch", variables.matchId] });
    },

    onError: (error: unknown) => {
      const axiosError = error as AxiosError; // 🔥 Convertir error a AxiosError

      console.error(
        "❌ Error al agregar jugadores:",
        axiosError.response?.data || axiosError.message
      );
    },
  });



  const registerPlayerToMatchMutation = useMutation({
    mutationFn: ({ matchId, body }: { matchId: number; body: any }) => registerPlayerToMatch(matchId, body),
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['doublesMatches'] });
      console.log("doublesMatches created", doublesMatches, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log("Error details:", error.response?.data || error.message, variables, context);
    },
  });

  const removePlayerFromMatchMutation = useMutation({
    mutationFn: ({ matchId, playerId }: { matchId: number; playerId: number }) => removePlayerMatch(matchId, playerId),
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['doublesMatches'] });
      console.log("te diste de baja correctamente", doublesMatches, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log("Error details:", error.response?.data || error.message, variables, context);
    },
  });



  return { addDoublesMatchesMutation, registerPlayerToMatchMutation, removePlayerFromMatchMutation, addPlayerToDoublesMatchesMutation };
};
