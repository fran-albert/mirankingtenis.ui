"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoublesEvent,
  updateDoublesEvent,
  deleteDoublesEvent,
} from "@/api/Doubles-Event/events";
import {
  createDoublesCategory,
  updateDoublesCategory,
  deleteDoublesCategory,
} from "@/api/Doubles-Event/categories";
import {
  createDoublesTeam,
  updateDoublesTeam,
  deleteDoublesTeam,
} from "@/api/Doubles-Event/teams";
import {
  createDoublesMatch,
  updateDoublesMatch,
  replaceDoublesMatch,
  updateDoublesMatchResult,
  deleteDoublesMatch,
} from "@/api/Doubles-Event/matches";
import {
  createDoublesTurn,
  updateDoublesTurn,
  deleteDoublesTurn,
} from "@/api/Doubles-Event/turns";
import {
  CreateDoublesEventRequest,
  CreateDoublesCategoryRequest,
  CreateDoublesTeamRequest,
  CreateDoublesMatchRequest,
  CreateDoublesTurnRequest,
  UpdateDoublesMatchResultRequest,
} from "@/types/Doubles-Event/DoublesEvent";

export const useDoublesEventMutations = () => {
  const queryClient = useQueryClient();

  // --- Events ---
  const createEventMutation = useMutation({
    mutationFn: (data: CreateDoublesEventRequest) => createDoublesEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-events"] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDoublesEventRequest>;
    }) => updateDoublesEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["doubles-events"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event", id] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => deleteDoublesEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-events"] });
    },
  });

  // --- Categories ---
  const createCategoryMutation = useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: number;
      data: CreateDoublesCategoryRequest;
    }) => createDoublesCategory(eventId, data),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: ["doubles-categories", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doubles-event", eventId],
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDoublesCategoryRequest>;
    }) => updateDoublesCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteDoublesCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-categories"] });
    },
  });

  // --- Teams ---
  const createTeamMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: CreateDoublesTeamRequest;
    }) => createDoublesTeam(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({
        queryKey: ["doubles-teams", categoryId],
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDoublesTeamRequest>;
    }) => updateDoublesTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-teams"] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: number) => deleteDoublesTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-teams"] });
    },
  });

  // --- Turns ---
  const createTurnMutation = useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: number;
      data: CreateDoublesTurnRequest;
    }) => createDoublesTurn(eventId, data),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["doubles-turns", eventId] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
    },
  });

  const updateTurnMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDoublesTurnRequest>;
    }) => updateDoublesTurn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-turns"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-matches"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
    },
  });

  const deleteTurnMutation = useMutation({
    mutationFn: (id: number) => deleteDoublesTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-turns"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
    },
  });

  // --- Matches ---
  const createMatchMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: CreateDoublesMatchRequest;
    }) => createDoublesMatch(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({
        queryKey: ["doubles-matches", categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDoublesMatchRequest>;
    }) => updateDoublesMatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-matches"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
    },
  });

  const replaceMatchMutation = useMutation({
    mutationFn: ({
      id,
      replacementMatchId,
    }: {
      id: number;
      replacementMatchId: number;
    }) => replaceDoublesMatch(id, replacementMatchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-matches"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-standings"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-turns"] });
    },
  });

  const updateMatchResultMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateDoublesMatchResultRequest;
    }) => updateDoublesMatchResult(id, data),
    // Note: invalidation is handled in the component after mutateAsync
    // to ensure data is refreshed before dialog closes
  });

  const deleteMatchMutation = useMutation({
    mutationFn: (id: number) => deleteDoublesMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubles-matches"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["doubles-event-matches"] });
    },
  });

  return {
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    createTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
    createTurnMutation,
    updateTurnMutation,
    deleteTurnMutation,
    createMatchMutation,
    updateMatchMutation,
    replaceMatchMutation,
    updateMatchResultMutation,
    deleteMatchMutation,
  };
};
