import axiosInstance from "@/services/axiosConfig";

export interface DefaultTournamentsResponse {
  defaultMasterTournament: number | null;
  defaultLeagueTournament: number | null;
}

export const getDefaultTournaments = async (): Promise<DefaultTournamentsResponse> => {
  const { data } = await axiosInstance.get<DefaultTournamentsResponse>('app-config/defaults');
  return data;
};
