import axiosInstance from "@/services/axiosConfig";

export const getGroupStagesByTournamentCategory = async (idTournament: number, idCategory: number): Promise<number> => {
    const response = await axiosInstance.get(`group-stage/tournament-category/${idTournament}/${idCategory}`);
    const tournament = response.data as number;
    return tournament;
}
