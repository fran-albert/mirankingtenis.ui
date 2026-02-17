"use client";
import { useQuery } from "@tanstack/react-query";
import { getSeriesByEvent, getSeries } from "@/api/Team-Event/series";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventSeries = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: series = [],
  } = useQuery({
    queryKey: teamEventKeys.series(eventId),
    queryFn: () => getSeriesByEvent(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
  });

  return { series, isLoading, isError };
};

export const useTeamEventSeriesDetail = (
  eventId: number,
  seriesId: number,
  enabled = true
) => {
  const {
    isLoading,
    isError,
    data: seriesDetail,
  } = useQuery({
    queryKey: teamEventKeys.seriesDetail(eventId, seriesId),
    queryFn: () => getSeries(eventId, seriesId),
    staleTime: 1000 * 60 * 2,
    enabled: enabled && !!eventId && !!seriesId,
  });

  return { seriesDetail, isLoading, isError };
};
