import axiosInstance from "@/services/axiosConfig";
import { Shift } from "@/types/Shift/Shift";

export interface SingleMatchRequest {
    createdBy: number;
    player1Id: number;
    player2Id?: number | null;
    startHour: string;
    idCourt: number;
    matchId: number; // Added to specify which match the shift is for
}

export interface SingleMatchResponse {
    id: number;
    createdBy: number;
    player1Id: number;
    player2Id?: number | null;
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

// Create shift for an existing match using the shiftForMatch endpoint
export const createShiftForMatch = async (shift: Shift, matchId: number): Promise<Shift> => {
    try {
        const { data } = await axiosInstance.post<Shift>(
            `shift/forMatch/${matchId}`,
            shift
        );
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};

// Keep the original function for backward compatibility if needed
export const createSingleMatch = async (match: SingleMatchRequest): Promise<SingleMatchResponse> => {
    try {
        // Por ahora usar el mismo endpoint que dobles pero con diferentes parámetros
        // TODO: Crear endpoint específico para partidos individuales
        const { data } = await axiosInstance.post<SingleMatchResponse>(`shift/single-match`, match);
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};