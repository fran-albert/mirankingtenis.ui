import axiosInstance from "@/services/axiosConfig";
import {
  TeamEventTeam,
  TeamEventPlayer,
  CreateTeamRequest,
  AddPlayerRequest,
  ReplacePlayerRequest,
} from "@/types/Team-Event/TeamEvent";

const basePath = (eventId: number, categoryId: number) =>
  `team-events/${eventId}/categories/${categoryId}/teams`;

export const getTeamsByCategory = async (
  eventId: number,
  categoryId: number
): Promise<TeamEventTeam[]> => {
  const response = await axiosInstance.get(basePath(eventId, categoryId));
  return response.data as TeamEventTeam[];
};

export const getTeam = async (
  eventId: number,
  categoryId: number,
  teamId: number
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.get(
    `${basePath(eventId, categoryId)}/${teamId}`
  );
  return response.data as TeamEventTeam;
};

export const createTeam = async (
  eventId: number,
  categoryId: number,
  data: CreateTeamRequest
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.post(
    basePath(eventId, categoryId),
    data
  );
  return response.data as TeamEventTeam;
};

export const updateTeam = async (
  eventId: number,
  categoryId: number,
  teamId: number,
  data: Partial<CreateTeamRequest>
): Promise<TeamEventTeam> => {
  const response = await axiosInstance.patch(
    `${basePath(eventId, categoryId)}/${teamId}`,
    data
  );
  return response.data as TeamEventTeam;
};

export const deleteTeam = async (
  eventId: number,
  categoryId: number,
  teamId: number
): Promise<void> => {
  await axiosInstance.delete(
    `${basePath(eventId, categoryId)}/${teamId}`
  );
};

export const addPlayer = async (
  eventId: number,
  categoryId: number,
  teamId: number,
  data: AddPlayerRequest
): Promise<TeamEventPlayer> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/${teamId}/players`,
    data
  );
  return response.data as TeamEventPlayer;
};

export const removePlayer = async (
  eventId: number,
  categoryId: number,
  teamId: number,
  playerId: number
): Promise<void> => {
  await axiosInstance.delete(
    `${basePath(eventId, categoryId)}/${teamId}/players/${playerId}`
  );
};

export const replacePlayer = async (
  eventId: number,
  categoryId: number,
  teamId: number,
  playerId: number,
  data: ReplacePlayerRequest
): Promise<TeamEventPlayer> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/${teamId}/players/${playerId}/replace`,
    data
  );
  return response.data as TeamEventPlayer;
};
