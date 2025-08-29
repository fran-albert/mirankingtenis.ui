import { Tournament, RelatedTournamentsResponse } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const getRelatedTournaments = async (
  tournamentId: number
): Promise<RelatedTournamentsResponse> => {
  const response = await axiosInstance.get(`tournament/${tournamentId}/related`);
  return response.data as RelatedTournamentsResponse;
};

export const getTournamentWithRelations = async (
  tournamentId: number
): Promise<Tournament> => {
  const response = await axiosInstance.get(`tournament/${tournamentId}/with-relations`);
  return response.data as Tournament;
};