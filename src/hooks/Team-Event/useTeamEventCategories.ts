"use client";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesByEvent } from "@/api/Team-Event/categories";
import { teamEventKeys } from "./teamEventKeys";

export const useTeamEventCategories = (eventId: number, enabled = true) => {
  const {
    isLoading,
    isError,
    data: categories = [],
  } = useQuery({
    queryKey: teamEventKeys.categories(eventId),
    queryFn: () => getCategoriesByEvent(eventId),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!eventId,
  });

  return { categories, isLoading, isError };
};
