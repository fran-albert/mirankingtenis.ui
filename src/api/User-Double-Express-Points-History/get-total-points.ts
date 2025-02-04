import axiosInstance from "@/services/axiosConfig";

export const getTotalPoints = async () => {
    try {
        const { data } = await axiosInstance.get<number>(`user-points-double-match-history/get-total-points`);
        return data;
    } catch (error: any) {
        // Lanzar el error de Axios correctamente para que sea capturado
        throw error || "Error desconocido";
    }
};