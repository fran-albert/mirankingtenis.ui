import { createFixture } from "@/api/Fixture/create";
import { createFixtureGroup } from "@/api/Fixture/create-fixture-group";
import { createPlayOff } from "@/api/Fixture/create-playoff";
import { Fixture } from "@/types/Fixture/Fixture";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFixtureMutations = () => {
  const queryClient = useQueryClient();

  const createFixtureMutation = useMutation({
    mutationFn: createFixture,
    onSuccess: (fixture, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'tournament-category'] });
      queryClient.invalidateQueries({ queryKey: ['fixture-counts'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      console.log("Fixture created", fixture, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating fixture:", error.response?.data || error.message, variables, context);
    },
  });

  const createFixtureGroupMutation = useMutation({
    mutationFn: ({ idTournament, idCategory }: { idTournament: number; idCategory: number }) => 
      createFixtureGroup(idTournament, idCategory),
    onSuccess: (result, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'tournament-category', variables.idCategory, variables.idTournament] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'group-stage-created', variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixture-counts'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['group'] });
      console.log("Fixture group created", result, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating fixture group:", error.response?.data || error.message, variables, context);
    },
  });

  const createPlayOffMutation = useMutation({
    mutationFn: ({ idTournament, idCategory }: { idTournament: number; idCategory: number }) => 
      createPlayOff(idTournament, idCategory),
    onSuccess: (result, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'category', variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'count', 'tournament-category', variables.idCategory, variables.idTournament] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'semi-finals', variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'quarter-finals', variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixtures', 'finals', variables.idTournament, variables.idCategory] });
      queryClient.invalidateQueries({ queryKey: ['fixture-counts'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['playoff'] });
      console.log("Playoff created", result, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating playoff:", error.response?.data || error.message, variables, context);
    },
  });

  return { 
    createFixtureMutation, 
    createFixtureGroupMutation, 
    createPlayOffMutation 
  };
};