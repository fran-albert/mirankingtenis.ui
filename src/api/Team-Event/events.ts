import axiosInstance from "@/services/axiosConfig";
import {
  TeamEvent,
  CreateTeamEventRequest,
} from "@/types/Team-Event/TeamEvent";

export const getAllTeamEvents = async (): Promise<TeamEvent[]> => {
  const response = await axiosInstance.get("team-events");
  return response.data as TeamEvent[];
};

export const getTeamEvent = async (id: number): Promise<TeamEvent> => {
  const response = await axiosInstance.get(`team-events/${id}`);
  return response.data as TeamEvent;
};

export const createTeamEvent = async (
  data: CreateTeamEventRequest
): Promise<TeamEvent> => {
  const response = await axiosInstance.post("team-events", data);
  return response.data as TeamEvent;
};

export const updateTeamEvent = async (
  id: number,
  data: Partial<CreateTeamEventRequest>
): Promise<TeamEvent> => {
  const response = await axiosInstance.patch(`team-events/${id}`, data);
  return response.data as TeamEvent;
};

export const deleteTeamEvent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`team-events/${id}`);
};
