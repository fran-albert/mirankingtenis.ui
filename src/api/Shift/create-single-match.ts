import axiosInstance from "@/services/axiosConfig";

export interface SingleMatchRequest {
    createdBy: number;
    player1Id: number;
    player2Id?: number | null;
    startHour: string;
    idCourt: number;
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