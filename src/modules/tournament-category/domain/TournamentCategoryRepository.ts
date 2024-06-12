import { TournamentCategory } from "./TournamentCategory";

export interface TournamentCategoryRepository {
    getCategoriesForTournament(idTournament: number): Promise<TournamentCategory[]>;
    createCategoryForTournament(idTournament: number, idCategory: number[]): Promise<TournamentCategory[]>;
    getTournamentCategoryId(idTournament: number, idCategory: number): Promise<number>;
}
