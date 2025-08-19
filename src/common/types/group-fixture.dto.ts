import { Sets } from "@/types/Set/Sets";
import { Shift } from "@/modules/shift/domain/Shift";

export interface GroupFixtureDto {
    id: number;
    fixture: number;
    groupName: string;
    user1: {
        id: number;
        name: string;
        lastname: string;
        position: number;
        photo: string;
    };
    user2: {
        id: number;
        name: string;
        position: number;
        lastname: string;
        photo: string;
    };
    idWinner: number;
    shift: Shift;
    court: string;
    tournamentCategoryId?: number;
    sets: Sets[];
    status: string;
    match?: number
    isBye: boolean;

}