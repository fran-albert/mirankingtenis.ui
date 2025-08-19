"use client"
import { getHistoryRanking } from "@/api/Tournament-Ranking/getHistoryRanking";
import { useQuery } from "@tanstack/react-query"

interface Props {
    idPlayer: number;
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useTournamentRankingHistory = ({ idPlayer, idTournament, idCategory, enabled = true }: Props) => {

    const { isLoading, isError, error, data: historyRanking = [], isFetching, refetch } = useQuery({
        queryKey: ['tournament-ranking-history', idPlayer, idTournament, idCategory],
        queryFn: () => getHistoryRanking(idPlayer, idTournament, idCategory),
        staleTime: 1000 * 60,
        enabled: enabled && !!idPlayer && !!idTournament && !!idCategory
    });

    return {
        historyRanking,
        error,
        isLoading,
        isError,
        isFetching,
        refetch
    }
}