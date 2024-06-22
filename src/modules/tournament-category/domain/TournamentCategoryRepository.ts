import { TournamentCategory } from "./TournamentCategory";

export interface TournamentCategoryRepository {
    getCategoriesForTournament(idTournament: number): Promise<TournamentCategory[]>;
    createCategoryForTournament(idTournament: number, idCategory: number[]): Promise<TournamentCategory[]>;
    getTournamentCategoriesByUser(idUser: number): Promise<any[]>;
    getTournamentCategoryId(idTournament: number, idCategory: number): Promise<number>;
}
