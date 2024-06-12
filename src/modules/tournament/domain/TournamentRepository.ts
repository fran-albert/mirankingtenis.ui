import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import { Tournament } from "./Tournament";

export interface TournamentRepository {
    getAllTournaments(): Promise<Tournament[]>;
    create(newTournament: Tournament): Promise<Tournament>;
    deleteTournament(idTournament: number): Promise<string>;
    startTournament(idTournament: number): Promise<string>;
    finishTournament(idTournament: number): Promise<string>;
    getTournament(idTournament: number): Promise<Tournament>;
    getTotalTournaments(): Promise<number>;
    getPlayerInfo(idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto>;
    getCompletedTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
    isCurrentTournament(idTournament: number): Promise<boolean>;
    getCurrentTournamentByPlayer(idPlayer: number): Promise<Tournament>;
    getAllTournamentsByPlayer(idPlayer: number): Promise<Tournament[]>;
}