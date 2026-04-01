import axiosInstance from "@/services/axiosConfig";
import {
  TournamentCategory,
  UpdateTournamentCategoryConfigRequest,
} from "@/types/Tournament-Category/TournamentCategory";

export const updateTournamentCategoryConfig = async ({
  tournamentId,
  categoryId,
  skipGroupStage,
  startingPlayoffRound,
}: UpdateTournamentCategoryConfigRequest): Promise<TournamentCategory> => {
  const response = await axiosInstance.patch(
    `tournament-categories/${tournamentId}/${categoryId}/config`,
    {
      skipGroupStage,
      startingPlayoffRound,
    }
  );

  return response.data as TournamentCategory;
};
