import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getGlobalPlayerSetSummary, GlobalSetSummary } from "@/api/Sets/get-global-set-summary";

export const useGlobalPlayerSetSummary = (
  playerId: number
): UseQueryResult<GlobalSetSummary, Error> => {
  return useQuery({
    queryKey: ['global-set-summary', playerId],
    queryFn: () => getGlobalPlayerSetSummary(playerId),
    enabled: !!playerId,
  });
};