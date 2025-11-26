import { PlayoffRound, TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import axiosInstance from "@/services/axiosConfig";

export const createCategoryForTournament = async (
    idTournament: number,
    idCategory: number[],
    skipGroupStage?: boolean,
    startingPlayoffRound?: PlayoffRound
): Promise<TournamentCategory[]> => {
    const response = await axiosInstance.post(`tournament-categories`, {
        tournamentId: idTournament,
        categoryIds: idCategory,
        skipGroupStage,
        startingPlayoffRound,
    });
    const tournament = response.data as TournamentCategory[];
    return tournament;
}