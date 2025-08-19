import axiosInstance from "@/services/axiosConfig";

export async function hasPlayersForCategory(idTournament: number, idCategory: number): Promise<boolean> {
    try {
        const response = await axiosInstance.get(`tournament-participants/has-players/${idTournament}/${idCategory}`);
        return response.data as boolean;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No players found for this tournament category.");
            return false;
        }
        console.error("Error checking players for category:", error);
        throw error;
    }
}