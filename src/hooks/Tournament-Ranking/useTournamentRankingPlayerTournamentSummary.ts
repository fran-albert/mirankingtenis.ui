"use client"
import { getTotalPlayerTournamentMatchSummary } from "@/api/Tournament-Ranking/getTotalPlayerTournamentMatchSummary";
import { useQuery } from "@tanstack/react-query"

interface Props {
    idPlayer: number;
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useTournamentRankingPlayerTournamentSummary = ({ idPlayer, idTournament, idCategory, enabled = true }: Props) => {

    const { isLoading, isError, error, data: playerMatchSummary, isFetching, refetch } = useQuery({
        queryKey: ['tournament-ranking-player-tournament-summary', idPlayer, idTournament, idCategory],
        queryFn: () => getTotalPlayerTournamentMatchSummary(idPlayer, idTournament, idCategory),
        staleTime: 1000 * 60,
        enabled: enabled && !!idPlayer && !!idTournament && !!idCategory
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