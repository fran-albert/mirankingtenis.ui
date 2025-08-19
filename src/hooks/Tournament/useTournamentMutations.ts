import { create } from "@/api/Tournament/create";
import { startTournament } from "@/api/Tournament/start-tournament";
import { finishTournament } from "@/api/Tournament/finish-tournament";
import { deleteTournament } from "@/api/Tournament/delete-tournament";
import { Tournament } from "@/types/Tournament/Tournament";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTournamentMutations = () => {
  const queryClient = useQueryClient();

  const createTournamentMutation = useMutation({
    mutationFn: create,
    onSuccess: (tournament, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'total'] });
      console.log("Tournament created", tournament, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating tournament:", error.response?.data || error.message, variables, context);
    },
  });

  const startTournamentMutation = useMutation({
    mutationFn: startTournament,
    onSuccess: (result, idTournament, context) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'isCurrent', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'current'] });
      console.log("Tournament started", result, idTournament, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error starting tournament:", error.response?.data || error.message, variables, context);
    },
  });

  const finishTournamentMutation = useMutation({
    mutationFn: finishTournament,
    onSuccess: (result, idTournament, context) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'isCurrent', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'lastFinishedLeague'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'completed'] });
      console.log("Tournament finished", result, idTournament, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error finishing tournament:", error.response?.data || error.message, variables, context);
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: (result, idTournament, context) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'total'] });
      queryClient.removeQueries({ queryKey: ['tournament', idTournament] });
      console.log("Tournament deleted", result, idTournament, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error deleting tournament:", error.response?.data || error.message, variables, context);
    },
  });

  return { 
    createTournamentMutation, 
    startTournamentMutation, 
    finishTournamentMutation, 
    deleteTournamentMutation 
  };
};