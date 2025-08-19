import axiosInstance from "@/services/axiosConfig";

export async function createParticipantsForTournament(
    idTournament: number,
    idCategory: number,
    userIds: number[],
    positionInitials: number[] | null,
    directToPlayoffsFlags: boolean[]
): Promise<string> {
    try {
        const response = await axiosInstance.post(`tournament-participants`, {
            tournamentId: idTournament,
            categoryId: idCategory,
            userIds,
            positionInitials,
            directToPlayoffsFlags
        });
        return response.data as string;
    } catch (error) {
        console.error("Error creating participants for tournament:", error);
        throw error;
    }
}