import axiosInstance from "@/services/axiosConfig";

export async function getNextMatch(idTournament: number, idUser: number): Promise<any> {
    try {
        const response = await axiosInstance.get(
            `matches/${idTournament}/players/${idUser}/next-match`
        );
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No next match found for this user in this tournament.");
            return null;
        }
        console.error("Error fetching next match:", error);
        throw error;
    }
}