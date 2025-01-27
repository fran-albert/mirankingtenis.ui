import { create } from "@/api/Doubles-Express/create";
import { IRegisterPlayer, registerPlayerToMatch } from "@/api/Doubles-Express/registerPlayerToMatch";
import { removePlayerMatch } from "@/api/Doubles-Express/removePlayerMatch";
import { useMutation, useQueryClient } from "@tanstack/react-query";


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

  const registerPlayerToMatchMutation = useMutation({
    mutationFn: ({ matchId, body }: { matchId: number; body: IRegisterPlayer }) => registerPlayerToMatch(matchId, body),
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



  return { addDoublesMatchesMutation, registerPlayerToMatchMutation, removePlayerFromMatchMutation };
};
