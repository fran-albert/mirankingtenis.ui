import axiosInstance from "@/services/axiosConfig";

export interface PlayoffStageStatus {
  exists: boolean;
  startingRound?: string;
  matchesCount?: number;
  playoffStageId?: number;
}

export async function getPlayoffStageStatus(
  idTournament: number,
  idCategory: number
): Promise<PlayoffStageStatus> {
  try {
    const response = await axiosInstance.get(
      `playoff/status/${idTournament}/${idCategory}`
    );
    return response.data as PlayoffStageStatus;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return { exists: false };
    }
    throw error;
  }
}
