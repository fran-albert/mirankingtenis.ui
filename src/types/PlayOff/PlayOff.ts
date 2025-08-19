import { Sets } from "@/types/Set/Sets";
import { Shift } from "@/modules/shift/domain/Shift";


export interface ResponsePlayOffDto {

    match: number;
    user1: {
        name: string;
        lastname: string;
        photo: string;
    };
    user2: {
        name: string;
        photo: string;
        lastname: string;
    };
    status: string;
    idWinner: number;
    shift: Shift;
    sets: Sets[];


}