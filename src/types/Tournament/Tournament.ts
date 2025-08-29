import { TournamentStatus } from "@/common/enum/tournamentStatus.enum";
import { TournamentSeason } from "@/common/enum/tournamentSeason.enum";
import { TournamentType } from "@/common/enum/tournament.enum";

export interface TournamentConfiguration {
    id: number;
    winnerPoints: number;
    loserPoints: number;
    decideMatchWinnerPoints: number;
    decideMatchLoserPoints: number;
}

export interface Tournament {
    id: number;
    name: string;
    status: TournamentStatus;
    createdAt: string;
    startedAt: string;
    finishedAt: string;
    type: string;
    season?: TournamentSeason;
    parentTournamentId?: number;
    parentTournament?: Tournament;
    childTournaments?: Tournament[];
    configuration?: TournamentConfiguration;
    tournamentType: TournamentType
}

export interface LinkTournamentRequest {
    leagueId: number;
}

export interface RelatedTournamentsResponse {
    parent?: Tournament;
    relatedTournament: Tournament;
}