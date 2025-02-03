import axiosInstance from "@/services/axiosConfig";

export const deleteDoubleMatch = async (id: number): Promise<string> => {
    try {
        const { data } = await axiosInstance.delete<string>(`doubles-exhibition-match/${id}`);
        return data;
    } catch (error: any) {
        throw error || "Error desconocido";
    }
};