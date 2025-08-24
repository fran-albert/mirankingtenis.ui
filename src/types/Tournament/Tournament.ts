import { TournamentStatus } from "@/common/enum/tournamentStatus.enum";

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
    configuration?: TournamentConfiguration;
}