import axiosInstance from "@/services/axiosConfig";

export interface GlobalSetSummary {
  totalSetsPlayed: number;
  totalSetsWon: number;
  totalSetsLost: number;
  setDifference: number;
}

export const getGlobalPlayerSetSummary = async (playerId: number): Promise<GlobalSetSummary> => {
  const response = await axiosInstance.get(`sets/players/${playerId}/global-set-summary`);
  return response.data as GlobalSetSummary;
};