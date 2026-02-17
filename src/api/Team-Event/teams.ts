import axiosInstance from "@/services/axiosConfig";
import {
  TeamEventTeam,
  TeamEventPlayer,
  CreateTeamRequest,
  AddPlayerRequest,
  ReplacePlayerRequest,
} from "@/types/Team-Event/TeamEvent";

export const getTeamsByEvent = async (
  eventId: number
): Promise<TeamEventTeam[]> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/teams`
  );
  return response.data as TeamEventTeam[];
};

export const getTeam = async (
  eventId: number,
  teamId: number
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/teams/${teamId}`
  );
  return response.data as TeamEventTeam;
};

export const createTeam = async (
  eventId: number,
  data: CreateTeamRequest
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/teams`,
    data
  );
  return response.data as TeamEventTeam;
};

export const updateTeam = async (
  eventId: number,
  teamId: number,
  data: Partial<CreateTeamRequest>
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.patch(
    `team-events/${eventId}/teams/${teamId}`,
    data
  );
  return response.data as TeamEventTeam;
};

export const deleteTeam = async (
  eventId: number,
  teamId: number
): Promise<void> => {
  await axiosInstance.delete(`team-events/${eventId}/teams/${teamId}`);
};

export const addPlayer = async (
  eventId: number,
  teamId: number,
  data: AddPlayerRequest
): Promise<TeamEventPlayer> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/teams/${teamId}/players`,
    data
  );
  return response.data as TeamEventPlayer;
};

export const removePlayer = async (
  eventId: number,
  teamId: number,
  playerId: number
): Promise<void> => {
  await axiosInstance.delete(
    `team-events/${eventId}/teams/${teamId}/players/${playerId}`
  );
};

export const replacePlayer = async (
  eventId: number,
  teamId: number,
  playerId: number,
  data: ReplacePlayerRequest
): Promise<TeamEventPlayer> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/teams/${teamId}/players/${playerId}/replace`,
    data
  );
  return response.data as TeamEventPlayer;
};
