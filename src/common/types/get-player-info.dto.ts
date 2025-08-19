import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { TournamentStatus } from "../enum/tournamentStatus.enum";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { Ranking } from "@/modules/ranking/domain/Ranking";

export interface GetPlayerInfoDto {
    tournament: {
        id: number;
        name: string;
        status: TournamentStatus;
        createdAt: Date;
        startedAt: Date;
        finishedAt: Date;
    };
    participant: TournamentParticipant;
    tournamentCategory: {
        id: number;
        name: string;
    };
    ranking: Ranking;
    isCurrent: boolean;
}
