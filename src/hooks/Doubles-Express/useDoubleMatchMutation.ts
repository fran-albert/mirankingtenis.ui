import { addPlayerToDoublesMatch } from "@/api/Doubles-Express/addPlayersToDoublesMatch";
import { create } from "@/api/Doubles-Express/create";
import { deleteDoubleMatch } from "@/api/Doubles-Express/delete";
import {
  IRegisterPlayer,
  registerPlayerToMatch,
} from "@/api/Doubles-Express/registerPlayerToMatch";
import { removePlayerMatch } from "@/api/Doubles-Express/removePlayerMatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useUserDoubleExpressPointHistory } from "../User-Double-Express-Points-History/useUserDoubleExpressPointHistory";

export const useDoubleMatchMutations = () => {
  const queryClient = useQueryClient();
  const addDoublesMatchesMutation = useMutation({
    mutationFn: create,
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });
      console.log("doublesMatches created", doublesMatches, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log(
        "Error details:",
        error.response?.data || error.message,
        variables,
        context
      );
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
      queryClient.setQueryData(
        ["doubleMatch", variables.matchId],
        updatedMatch
      );

      // 🔄 Invalidar la lista global de partidos
      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });

      // 🔄 Refetchear manualmente los datos
      queryClient.refetchQueries({
        queryKey: ["doubleMatch", variables.matchId],
      });
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
    mutationFn: ({ matchId, body }: { matchId: number; body: any }) =>
      registerPlayerToMatch(matchId, body),
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });
      queryClient.invalidateQueries({ queryKey: ["points"] });
      console.log("doublesMatches created", doublesMatches, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log(
        "Error details:",
        error.response?.data || error.message,
        variables,
        context
      );
    },
  });

  const removePlayerFromMatchMutation = useMutation({
    mutationFn: ({
      matchId,
      playerId,
    }: {
      matchId: number;
      playerId: number;
    }) => removePlayerMatch(matchId, playerId),
    onSuccess: (doublesMatches, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });
      queryClient.invalidateQueries({ queryKey: ["points"] });
      console.log(
        "te diste de baja correctamente",
        doublesMatches,
        variables,
        context
      );
    },

    onError: (error: any, variables, context) => {
      console.log(
        "Error details:",
        error.response?.data || error.message,
        variables,
        context
      );
    },
  });

  const deleteDoubleMatchFn = useMutation({
    mutationFn: ({ matchId }: { matchId: number }) =>
      deleteDoubleMatch(matchId),
    onSuccess: (_, variables) => {
      // 🔥 Eliminar el partido de la lista sin recargar la página
      queryClient.setQueryData(["doublesMatches"], (oldMatches: any) => {
        return oldMatches
          ? oldMatches.filter((match: any) => match.id !== variables.matchId)
          : [];
      });

      queryClient.invalidateQueries({ queryKey: ["doublesMatches"] });

      console.log(
        `Partido con ID ${variables.matchId} eliminado correctamente.`
      );
    },
    onError: (error: any) => {
      console.log(
        "Error al eliminar el partido:",
        error.response?.data || error.message
      );
    },
  });

  return {
    addDoublesMatchesMutation,
    registerPlayerToMatchMutation,
    removePlayerFromMatchMutation,
    addPlayerToDoublesMatchesMutation,
    deleteDoubleMatchFn,
  };
};
