import axiosInstance from "@/services/axiosConfig";

export async function decideMatch(id: number, winnerUserId: number, tournamentCategoryId: number): Promise<void> {
    try {
        const response = await axiosInstance.post(`matches/${id}/decide-winner`, {
            winnerUserId, 
            tournamentCategoryId
        });
        return response.data;
    } catch (error) {
        console.error("Error deciding match winner:", error);
        throw error;
    }
}