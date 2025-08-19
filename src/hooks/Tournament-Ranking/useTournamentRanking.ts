"use client"
import { getAllRankingsByTournamentCategory } from "@/api/Tournament-Ranking/getAllRankingsByTournamentCategory";
import { useQuery } from "@tanstack/react-query"

interface Props {
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useTournamentRanking = ({ idTournament, idCategory, enabled = true }: Props) => {

    const { isLoading, isError, error, data: rankings = [], isFetching, refetch } = useQuery({
        queryKey: ['tournament-ranking', idTournament, idCategory],
        queryFn: () => getAllRankingsByTournamentCategory(idTournament, idCategory),
        staleTime: 1000 * 60,
        enabled: enabled && !!idTournament && !!idCategory
    });

    return {
        rankings,
        error,
        isLoading,
        isError,
        isFetching,
        refetch
    }
}