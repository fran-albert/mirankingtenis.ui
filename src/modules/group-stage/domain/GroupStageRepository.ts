
export interface GroupStageRepository {
    getGroupStagesByTournamentCategory(idTournament: number, idCategory: number): Promise<number>;
}