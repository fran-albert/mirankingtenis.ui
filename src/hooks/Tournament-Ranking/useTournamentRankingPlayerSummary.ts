"use client"
import { getTotalPlayerMatchSummary } from "@/api/Tournament-Ranking/getTotalPlayerMatchSummary";
import { useQuery } from "@tanstack/react-query"

interface Props {
    idPlayer: number;
    enabled?: boolean;
}

export const useTournamentRankingPlayerSummary = ({ idPlayer, enabled = true }: Props) => {

    const { isLoading, isError, error, data: playerMatchSummary, isFetching, refetch } = useQuery({
        queryKey: ['tournament-ranking-player-summary', idPlayer],
        queryFn: () => getTotalPlayerMatchSummary(idPlayer),
        staleTime: 1000 * 60,
        enabled: enabled && !!idPlayer
    });

    return {
        playerMatchSummary,
        error,
        isLoading,
        isError,
        isFetching,
        refetch
    }
}