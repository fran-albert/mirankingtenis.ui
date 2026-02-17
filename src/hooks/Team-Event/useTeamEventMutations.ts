"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeamEvent,
  updateTeamEvent,
  deleteTeamEvent,
} from "@/api/Team-Event/events";
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
} from "@/api/Team-Event/series";
import { finalizeEvent } from "@/api/Team-Event/standings";
import { teamEventKeys } from "./teamEventKeys";
import {
  CreateTeamEventRequest,
  CreateTeamRequest,
  AddPlayerRequest,
  ReplacePlayerRequest,
  LoadSeriesResultRequest,
  FinalizeEventRequest,
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

export const useTeamMutations = (eventId: number) => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.teams(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.detail(eventId),
    });
  };

  const createTeamMutation = useMutation({
    mutationFn: (data: CreateTeamRequest) => createTeam(eventId, data),
    onSuccess: invalidate,
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data: Partial<CreateTeamRequest>;
    }) => updateTeam(eventId, teamId, data),
    onSuccess: invalidate,
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: number) => deleteTeam(eventId, teamId),
    onSuccess: invalidate,
  });

  const addPlayerMutation = useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data: AddPlayerRequest;
    }) => addPlayer(eventId, teamId, data),
    onSuccess: invalidate,
  });

  const removePlayerMutation = useMutation({
    mutationFn: ({
      teamId,
      playerId,
    }: {
      teamId: number;
      playerId: number;
    }) => removePlayer(eventId, teamId, playerId),
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
    }) => replacePlayer(eventId, teamId, playerId, data),
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

export const useSeriesMutations = (eventId: number) => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.series(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.standings(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.playerStats(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: teamEventKeys.detail(eventId),
    });
  };

  const generateFixtureMutation = useMutation({
    mutationFn: () => generateFixture(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.series(eventId),
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
    }) => loadSeriesResult(eventId, seriesId, data),
    onSuccess: invalidate,
  });

  const updateResultMutation = useMutation({
    mutationFn: ({
      seriesId,
      data,
    }: {
      seriesId: number;
      data: LoadSeriesResultRequest;
    }) => updateSeriesResult(eventId, seriesId, data),
    onSuccess: invalidate,
  });

  return { generateFixtureMutation, loadResultMutation, updateResultMutation };
};

export const useStandingsMutations = (eventId: number) => {
  const queryClient = useQueryClient();

  const finalizeMutation = useMutation({
    mutationFn: (data: FinalizeEventRequest) => finalizeEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.series(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.standings(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: teamEventKeys.detail(eventId),
      });
    },
  });

  return { finalizeMutation };
};
