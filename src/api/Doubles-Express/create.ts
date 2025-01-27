import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatchRequest } from "@/types/Double-Match/DoublesExhibitionMatch";

export const create = async (match: DoublesExhibitionMatchRequest) => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatchRequest>(`doubles-exhibition-match`, match);
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};