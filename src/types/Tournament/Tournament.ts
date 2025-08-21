import { TournamentStatus } from "@/common/enum/tournamentStatus.enum";

export interface Tournament {
    id: number;
    name: string;
    status: TournamentStatus;
    createdAt: string;
    startedAt: string;
    finishedAt: string;
    type: string;
}