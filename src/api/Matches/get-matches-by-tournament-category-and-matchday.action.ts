import axiosInstance from "@/services/axiosConfig";

export async function getMatchesByTournamentCategoryAndMatchday(idTournamentCategory: number, matchDay: number): Promise<any[]> {
    try {
        const response = await axiosInstance.get(
            `matches/tournament-category/${idTournamentCategory}/matchday/${matchDay}`
        );
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            console.error("No matches found for this tournament category and matchday.");
            return [];
        }
        console.error("Error fetching matches by tournament category and matchday:", error);
        throw error;
    }
}