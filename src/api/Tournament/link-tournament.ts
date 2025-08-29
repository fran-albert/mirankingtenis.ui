import { Tournament, LinkTournamentRequest } from "@/types/Tournament/Tournament";
import axiosInstance from "@/services/axiosConfig";

export const linkMasterToLeague = async (
  masterId: number,
  request: LinkTournamentRequest
): Promise<Tournament> => {
  const response = await axiosInstance.put(`tournament/${masterId}/link`, request);
  return response.data as Tournament;
};