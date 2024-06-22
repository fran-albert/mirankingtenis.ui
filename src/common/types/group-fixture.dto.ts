import { Sets } from "@/modules/sets/domain/Sets";
import { Shift } from "@/modules/shift/domain/Shift";

export interface GroupFixtureDto {
    id: number;
    fixture: number;
    groupName: string;
    user1: {
        id: number;
        name: string;
        position: number;
        photo: string;
    };
    user2: {
        id: number;
        name: string;
        position: number;
        photo: string;
    };
    idWinner: number;
    shift: string;
    court: string;
    sets: Sets[];
    status: string;

}