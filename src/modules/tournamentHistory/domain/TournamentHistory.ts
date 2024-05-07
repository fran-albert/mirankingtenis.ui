export interface TournamentHistoryRepository {
    id: number;
    event: string;
    date: Date;
    tournamentId: number;
    userId: number;
}