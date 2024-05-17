import { Tournament } from "./Tournament";

export interface TournamentRepository {
    getAllTournaments(): Promise<Tournament[]>;
    create(newTournament: Tournament): Promise<Tournament>;
    deleteTournament(idTournament: number): Promise<string>;
    startTournament(idTournament: number): Promise<string>;
    finishTournament(idTournament: number): Promise<string>;
    getTournament(idTournament: number): Promise<Tournament>;
    getTotalTournaments(): Promise<number>;
}