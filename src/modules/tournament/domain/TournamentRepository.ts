import { Tournament } from "./Tournament";

export interface TournamentRepository {
    desactivatePlayer(idPlayer: number, idTournament: number): Promise<string>;
    getAllTournaments(): Promise<Tournament[]>;
}