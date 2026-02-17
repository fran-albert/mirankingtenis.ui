"use client";
import { useQuery } from "@tanstack/react-query";
import { getSeriesByCategory, getSeries } from "@/api/Team-Event/series";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventSeries = (
  eventId: number,
  categoryId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: series = [],
  } = useQuery({
    queryKey: teamEventKeys.series(eventId, categoryId),
    queryFn: () => getSeriesByCategory(eventId, categoryId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId && !!categoryId,
  });

  return { series, isLoading, isError };
};

export const useTeamEventSeriesDetail = (
  eventId: number,
  categoryId: number,
  seriesId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: seriesDetail,
  } = useQuery({
    queryKey: teamEventKeys.seriesDetail(eventId, categoryId, seriesId),
    queryFn: () => getSeries(eventId, categoryId, seriesId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId && !!categoryId && !!seriesId,
  });

  return { seriesDetail, isLoading, isError };
};
