import { Court } from "@/modules/court/domain/Court";

export interface UpdateShiftRequest {
    startHour: Date;
    idCourt: number
}
export interface UpdateShiftResponse {
    id: number;
    startHour: Date;
    endHour: Date;
    court: Court;
}

export interface Shift {
    id: number;
    startHour: string;
    date: Date;
    court: Court | string;
}
