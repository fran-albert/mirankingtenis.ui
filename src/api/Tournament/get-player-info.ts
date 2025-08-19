import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import axiosInstance from "@/services/axiosConfig";

export const getPlayerInfo = async (idTournament: number, idPlayer: number): Promise<GetPlayerInfoDto> => {
    const response = await axiosInstance.get(`tournament/${idTournament}/players/${idPlayer}`);
    const tournament = response.data as any;
    return tournament;
}