import axiosInstance from "@/services/axiosConfig";
import { DoublesExhibitionMatch } from "@/types/Double-Match/DoublesExhibitionMatch";

export const create = async (match: DoublesExhibitionMatch) => {
    try {
        const { data } = await axiosInstance.post<DoublesExhibitionMatch>(`doubles-exhibition-match`, match);
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};