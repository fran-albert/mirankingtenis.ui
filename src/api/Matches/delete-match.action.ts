import axiosInstance from "@/services/axiosConfig";

export async function deleteMatch(id: number): Promise<void> {
    try {
        const response = await axiosInstance.delete(`matches/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting match:", error);
        throw error;
    }
}