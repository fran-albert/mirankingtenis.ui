import { createCategoryForTournament } from "@/api/Tournament-Category/create-category-for-tournament";
import { PlayoffRound } from "@/types/Tournament-Category/TournamentCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTournamentCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategoryForTournamentMutation = useMutation({
    mutationFn: ({
      idTournament,
      idCategory,
      skipGroupStage,
      startingPlayoffRound
    }: {
      idTournament: number;
      idCategory: number[];
      skipGroupStage?: boolean;
      startingPlayoffRound?: PlayoffRound;
    }) =>
      createCategoryForTournament(idTournament, idCategory, skipGroupStage, startingPlayoffRound),
    onSuccess: (result, { idTournament, idCategory }, context) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['categories', 'tournament', idTournament] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Para actualizar la lista de categorías disponibles
      queryClient.invalidateQueries({ queryKey: ['tournamentCategories'] });
      console.log("Tournament category created", result, { idTournament, idCategory }, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating tournament category:", error.response?.data || error.message, variables, context);
    },
  });

  return {
    createCategoryForTournamentMutation
  };
};