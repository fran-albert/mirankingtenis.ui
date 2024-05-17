import { TournamentCategory } from "./TournamentCategory";

export interface TournamentCategoryRepository {
    getCategoriesForTournament(idTournament: number): Promise<TournamentCategory[]>;
}
