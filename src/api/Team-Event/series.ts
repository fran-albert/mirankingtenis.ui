import axiosInstance from "@/services/axiosConfig";
import {
  TeamEventSeries,
  LoadSeriesResultRequest,
} from "@/types/Team-Event/TeamEvent";

export const getSeriesByEvent = async (
  eventId: number
): Promise<TeamEventSeries[]> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/series`
  );
  return response.data as TeamEventSeries[];
};

export const getSeries = async (
  eventId: number,
  seriesId: number
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/series/${seriesId}`
  );
  return response.data as TeamEventSeries;
};

export const generateFixture = async (
  eventId: number
): Promise<TeamEventSeries[]> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/series/generate`
  );
  return response.data as TeamEventSeries[];
};

export const loadSeriesResult = async (
  eventId: number,
  seriesId: number,
  data: LoadSeriesResultRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/series/${seriesId}/result`,
    data
  );
  return response.data as TeamEventSeries;
};

export const updateSeriesResult = async (
  eventId: number,
  seriesId: number,
  data: LoadSeriesResultRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.patch(
    `team-events/${eventId}/series/${seriesId}/result`,
    data
  );
  return response.data as TeamEventSeries;
};
