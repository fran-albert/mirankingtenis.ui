import axiosInstance from "@/services/axiosConfig";
import {
  TeamEventSeries,
  CreateSeriesRequest,
  LoadSeriesResultRequest,
  SetLineupRequest,
  LoadMatchScoreRequest,
  TeamEventMatch,
} from "@/types/Team-Event/TeamEvent";

const basePath = (eventId: number, categoryId: number) =>
  `team-events/${eventId}/categories/${categoryId}/series`;

export const getSeriesByCategory = async (
  eventId: number,
  categoryId: number
): Promise<TeamEventSeries[]> => {
  const response = await axiosInstance.get(basePath(eventId, categoryId));
  return response.data as TeamEventSeries[];
};

export const getSeries = async (
  eventId: number,
  categoryId: number,
  seriesId: number
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.get(
    `${basePath(eventId, categoryId)}/${seriesId}`
  );
  return response.data as TeamEventSeries;
};

export const generateFixture = async (
  eventId: number,
  categoryId: number
): Promise<TeamEventSeries[]> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/generate`
  );
  return response.data as TeamEventSeries[];
};

export const loadSeriesResult = async (
  eventId: number,
  categoryId: number,
  seriesId: number,
  data: LoadSeriesResultRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/${seriesId}/result`,
    data
  );
  return response.data as TeamEventSeries;
};

export const updateSeriesResult = async (
  eventId: number,
  categoryId: number,
  seriesId: number,
  data: LoadSeriesResultRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.patch(
    `${basePath(eventId, categoryId)}/${seriesId}/result`,
    data
  );
  return response.data as TeamEventSeries;
};

export const setLineup = async (
  eventId: number,
  categoryId: number,
  seriesId: number,
  data: SetLineupRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    `${basePath(eventId, categoryId)}/${seriesId}/lineup`,
    data
  );
  return response.data as TeamEventSeries;
};

export const loadMatchScore = async (
  eventId: number,
  categoryId: number,
  seriesId: number,
  matchId: number,
  data: LoadMatchScoreRequest
): Promise<TeamEventMatch> => {
  const response = await axiosInstance.patch(
    `${basePath(eventId, categoryId)}/${seriesId}/matches/${matchId}/score`,
    data
  );
  return response.data as TeamEventMatch;
};

export const createSeries = async (
  eventId: number,
  categoryId: number,
  data: CreateSeriesRequest
): Promise<TeamEventSeries> => {
  const response = await axiosInstance.post(
    basePath(eventId, categoryId),
    data
  );
  return response.data as TeamEventSeries;
};

export const deleteSeries = async (
  eventId: number,
  categoryId: number,
  seriesId: number
): Promise<void> => {
  await axiosInstance.delete(
    `${basePath(eventId, categoryId)}/${seriesId}`
  );
};

export const deleteFixture = async (
  eventId: number,
  categoryId: number
): Promise<void> => {
  await axiosInstance.delete(
    `${basePath(eventId, categoryId)}/fixture`
  );
};
