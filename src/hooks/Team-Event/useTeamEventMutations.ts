"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeamEvent,
  updateTeamEvent,
  deleteTeamEvent,
} from "@/api/Team-Event/events";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/Team-Event/categories";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  removePlayer,
  replacePlayer,
} from "@/api/Team-Event/teams";
import {
  generateFixture,
  loadSeriesResult,
  updateSeriesResult,
  setLineup,
  loadMatchScore,
} from "@/api/Team-Event/series";
import { finalizeEvent } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";
import {
  CreateTeamEventRequest,
  CreateTeamEventCategoryRequest,
  UpdateTeamEventCategoryRequest,
  CreateTeamRequest,
  AddPlayerRequest,
  ReplacePlayerRequest,
  LoadSeriesResultRequest,
  FinalizeEventRequest,
  SetLineupRequest,
  LoadMatchScoreRequest,
} from "@/types/Team-Event/TeamEvent";

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (data: CreateTeamEventRequest) => createTeamEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamEventKeys.all });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTeamEventRequest>;
    }) => updateTeamEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: teamEventKeys.all });
      queryClient.invalidateQueries({ queryKey: teamEventKeys.detail(id) });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => deleteTeamEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamEventKeys.all });
    },
  });

  return { createEventMutation, updateEventMutation, deleteEventMutation };
};

export const useCategoryMutations = (eventId: number) => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.categories(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.detail(eventId),
    });
  };

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateTeamEventCategoryRequest) =>
      createCategory(eventId, data),
    onSuccess: invalidate,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: UpdateTeamEventCategoryRequest;
    }) => updateCategory(eventId, categoryId, data),
    onSuccess: invalidate,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => deleteCategory(eventId, categoryId),
    onSuccess: invalidate,
  });

  return {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};

export const useTeamMutations = (eventId: number, categoryId: number) => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.teams(eventId, categoryId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.detail(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.categories(eventId),
    });
  };

  const createTeamMutation = useMutation({
    mutationFn: (data: CreateTeamRequest) =>
      createTeam(eventId, categoryId, data),
    onSuccess: invalidate,
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data: Partial<CreateTeamRequest>;
    }) => updateTeam(eventId, categoryId, teamId, data),
    onSuccess: invalidate,
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: number) => deleteTeam(eventId, categoryId, teamId),
    onSuccess: invalidate,
  });

  const addPlayerMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data: AddPlayerRequest;
    }) => addPlayer(eventId, categoryId, teamId, data),
    onSuccess: invalidate,
  });

  const removePlayerMutation = useMutation({
    mutationFn: ({
      teamId,
      playerId,
    }: {
      teamId: number;
      playerId: number;
    }) => removePlayer(eventId, categoryId, teamId, playerId),
    onSuccess: invalidate,
  });

  const replacePlayerMutation = useMutation({
    mutationFn: ({
      teamId,
      playerId,
      data,
    }: {
      teamId: number;
      playerId: number;
      data: ReplacePlayerRequest;
    }) => replacePlayer(eventId, categoryId, teamId, playerId, data),
    onSuccess: invalidate,
  });

  return {
    createTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
    addPlayerMutation,
    removePlayerMutation,
    replacePlayerMutation,
  };
};

export const useSeriesMutations = (eventId: number, categoryId: number) => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.series(eventId, categoryId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.standings(eventId, categoryId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.playerStats(eventId, categoryId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.detail(eventId),
    });
  };

  const generateFixtureMutation = useMutation({
    mutationFn: () => generateFixture(eventId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.series(eventId, categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.detail(eventId),
      });
    },
  });

  const loadResultMutation = useMutation({
    mutationFn: ({
      seriesId,
      data,
    }: {
      seriesId: number;
      data: LoadSeriesResultRequest;
    }) => loadSeriesResult(eventId, categoryId, seriesId, data),
    onSuccess: invalidate,
  });

  const updateResultMutation = useMutation({
    mutationFn: ({
      seriesId,
      data,
    }: {
      seriesId: number;
      data: LoadSeriesResultRequest;
    }) => updateSeriesResult(eventId, categoryId, seriesId, data),
    onSuccess: invalidate,
  });

  const setLineupMutation = useMutation({
    mutationFn: ({
      seriesId,
      data,
    }: {
      seriesId: number;
      data: SetLineupRequest;
    }) => setLineup(eventId, categoryId, seriesId, data),
    onSuccess: invalidate,
  });

  const loadMatchScoreMutation = useMutation({
    mutationFn: ({
      seriesId,
      matchId,
      data,
    }: {
      seriesId: number;
      matchId: number;
      data: LoadMatchScoreRequest;
    }) => loadMatchScore(eventId, categoryId, seriesId, matchId, data),
    onSuccess: invalidate,
  });

  return {
    generateFixtureMutation,
    loadResultMutation,
    updateResultMutation,
    setLineupMutation,
    loadMatchScoreMutation,
  };
};

export const useStandingsMutations = (
  eventId: number,
  categoryId: number
) => {
  const queryClient = useQueryClient();

  const finalizeMutation = useMutation({
    mutationFn: (data: FinalizeEventRequest) =>
      finalizeEvent(eventId, categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.series(eventId, categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.standings(eventId, categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.detail(eventId),
      });
    },
  });

  return { finalizeMutation };
};
