import axiosInstance from "@/services/axiosConfig";
import {
  TeamStandingResponse,
  PlayerStatsResponse,
  TeamEventSeries,
  FinalizeEventRequest,
} from "@/types/Team-Event/TeamEvent";

const basePath = (eventId: number, categoryId: number) =>
  `team-events/${eventId}/categories/${categoryId}`;

export const getStandings = async (
  eventId: number,
  categoryId: number
): Promise<TeamStandingResponse[]> => {
  const response = await axiosInstance.get(
    `${basePath(eventId, categoryId)}/standings`
  );
  return response.data as TeamStandingResponse[];
};

export const getPlayerStats = async (
  eventId: number,
  categoryId: number
): Promise<PlayerStatsResponse[]> => {
  const response = await axiosInstance.get(
    `${basePath(eventId, categoryId)}/stats/players`
  );
  return response.data as PlayerStatsResponse[];
};

export const finalizeEvent = async (
  eventId: number,
  categoryId: number,
  data: FinalizeEventRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/finalize`,
    data
  );
  return response.data as TeamEventSeries;
};
