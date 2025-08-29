import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { Tournament, LinkTournamentRequest, RelatedTournamentsResponse } from "@/types/Tournament/Tournament";
import { linkMasterToLeague } from "@/api/Tournament/link-tournament";
import { getRelatedTournaments, getTournamentWithRelations } from "@/api/Tournament/get-related-tournaments";
import { toast } from "sonner";

export const useLinkTournament = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ masterId, request }: { masterId: number; request: LinkTournamentRequest }) =>
      linkMasterToLeague(masterId, request),
    onSuccess: (data) => {
      // Invalidate and refetch tournament queries
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', data.id] });
      queryClient.invalidateQueries({ queryKey: ['related-tournaments'] });
      
      toast.success(`Master "${data.name}" vinculado exitosamente`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al vincular torneos');
    },
  });
};

export const useRelatedTournaments = (
  tournamentId: number
): UseQueryResult<RelatedTournamentsResponse, Error> => {
  return useQuery({
    queryKey: ['related-tournaments', tournamentId],
    queryFn: () => getRelatedTournaments(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentWithRelations = (
  tournamentId: number
): UseQueryResult<Tournament, Error> => {
  return useQuery({
    queryKey: ['tournament-with-relations', tournamentId],
    queryFn: () => getTournamentWithRelations(tournamentId),
    enabled: !!tournamentId,
  });
};