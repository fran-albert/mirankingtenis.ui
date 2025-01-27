import { User } from "../User/User";

export interface DoublesExhibitionMatchRequest  {
    id?: number;
    createdBy: number;
    player1Id: number;
    player2Id?: number | null;
    player3Id?: number | null;
    player4Id?: number | null;
    startHour: string;
    idCourt: number;
}

export interface DoublesExhibitionMatchResponse {
    id: number;
    createdBy: User;
    player1: User;
    player2?: User | null;
    player3?: User | null;
    player4?: User | null;
    startHour: string;
    shift: {
        id: number;
        startHour: string;
        endHour: string;
        court: {
            id: number;
            name: string;
        };
    };
}