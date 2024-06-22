import axiosInstance from "@/services/axiosConfig";
import { TournamentCategoryRepository } from "../domain/TournamentCategoryRepository";
import { TournamentCategory } from "../domain/TournamentCategory";

export function createApiTournamentCategoryRepository(): TournamentCategoryRepository {

    async function createCategoryForTournament(idTournament: number, idCategory: number[]): Promise<TournamentCategory[]> {
        const response = await axiosInstance.post(`tournament-categories`, { tournamentId: idTournament, categoryIds: idCategory });
        const tournament = response.data as TournamentCategory[];
        return tournament;
    }

    async function getTournamentCategoryId(idTournament: number, idCategory: number): Promise<number> {
        const response = await axiosInstance.get(`tournament-categories/${idTournament}/${idCategory}`);
        const tournament = response.data as number;
        return tournament;
    }

    async function getTournamentCategoriesByUser(idUser: number): Promise<any[]> {
        const response = await axiosInstance.get(`tournament-categories/user/${idUser}`);
        const tournament = response.data as TournamentCategory[];
        return tournament;
    }

    async function getCategoriesForTournament(idTournament: number): Promise<TournamentCategory[]> {
        const response = await axiosInstance.get(`tournament-categories/${idTournament}`);
        const tournament = response.data as TournamentCategory[];
        return tournament;
    }

    return {
        getCategoriesForTournament, createCategoryForTournament, getTournamentCategoryId, getTournamentCategoriesByUser
    };
}
