import { Shift } from "@/types/Shift/Shift";
import { TournamentStatus } from "../enum/tournamentStatus.enum";
import { Sets } from "@/types/Set/Sets";

export interface NextMatchDto {
    id: number;
    idWinner: number | null;
    deletedAt: Date | null;
    status: TournamentStatus;
    user1: {
        name: string;
        lastname: string;
        position: number;
    };
    user2: {
        name: string;
        lastname: string;
        position: number;
    };
    fixture: {
        id: number;
        jornada: number;
    };
    shift: Shift | null;
    sets: Sets[] | null;
}
