import axiosInstance from "@/services/axiosConfig";

export async function desactivatePlayer(idPlayer: number, tournamentId: number): Promise<string> {
    try {
        const response = await axiosInstance.post(`tournament-participants/desactivate/${idPlayer}/${tournamentId}/`);
        const user = response.data as string;
        return user;
    } catch (error) {
        console.error("Error deactivating player:", error);
        throw error;
    }
}