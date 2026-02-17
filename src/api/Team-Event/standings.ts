import axiosInstance from "@/services/axiosConfig";
import {
  TeamStandingResponse,
  PlayerStatsResponse,
  TeamEventSeries,
  FinalizeEventRequest,
} from "@/types/Team-Event/TeamEvent";

export const getStandings = async (
  eventId: number
): Promise<TeamStandingResponse[]> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/standings`
  );
  return response.data as TeamStandingResponse[];
};

export const getPlayerStats = async (
  eventId: number
): Promise<PlayerStatsResponse[]> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/stats/players`
  );
  return response.data as PlayerStatsResponse[];
};

export const finalizeEvent = async (
  eventId: number,
  data: FinalizeEventRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/finalize`,
    data
  );
  return response.data as TeamEventSeries;
};
