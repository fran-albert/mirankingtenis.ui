import axiosInstance from "@/services/axiosConfig";
import { UpdateShiftRequest, UpdateShiftResponse } from "@/types/Shift/Shift";

export const updateShiftForDoubleMatch = async (matchId: number, body: UpdateShiftRequest): Promise<UpdateShiftResponse> => {
    try {
        const { data } = await axiosInstance.put<UpdateShiftResponse>(`shift/doubles-match/${matchId}`, body);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};