import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTournamentsByUser } from "@/api/Tournament/get-tournaments-by-user";

export const useTournamentsByUser = (
  userId: number
): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: ['tournaments-by-user', userId],
    queryFn: () => getTournamentsByUser(userId),
    enabled: !!userId,
  });
};