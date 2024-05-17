import axiosInstance from "@/services/axiosConfig";
import { TournamentCategoryRepository } from "../domain/TournamentCategoryRepository";
import { TournamentCategory } from "../domain/TournamentCategory";

export function createApiTournamentCategoryRepository(): TournamentCategoryRepository {

    async function getCategoriesForTournament(idTournament: number): Promise<TournamentCategory[]> {
        const response = await axiosInstance.get(`tournament-categories/${idTournament}`);
        const tournament = response.data as TournamentCategory[];
        return tournament;
    }

    return {
        getCategoriesForTournament
    };
}
