"use client"
import { getAllMatches } from "@/api/Matches/get-all-matches";
import { getMatchesByDate } from "@/api/Matches/get-matches-by-date";
import { findMatchesByGroupStage } from "@/api/Matches/findMatchesByGroupStage";
import { useQuery } from "@tanstack/react-query"


export const useMatches = ({}) => {

    const { isLoading, isError, error, data: matches = [], isFetching } = useQuery({
        queryKey: ['matches'],
        queryFn: () => getAllMatches(),
        staleTime: 1000 * 60,
    });

    const { isLoading: isLoadingMatchesByDate, isError: isErrorMatchesByDate, error: errorMatchesByDate, data: MatchesByDate = [], isFetching: isFetchingMatchesByDate } = useQuery({
        queryKey: ['matches'],
        queryFn: () => getMatchesByDate(),
        staleTime: 1000 * 60,
    });

    return {
        matches,
        error,
        isLoading,
        isError, isFetching,
        MatchesByDate, errorMatchesByDate, isLoadingMatchesByDate, isFetchingMatchesByDate
    }

}

export const useMatchesByGroupStage = (groupStageId: number, enabled: boolean = true) => {
    const { isLoading, isError, error, data: groupFixture = [], isFetching, refetch } = useQuery({
        queryKey: ['matches', 'byGroupStage', groupStageId],
        queryFn: () => findMatchesByGroupStage(groupStageId),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!groupStageId
    });

    return {
        groupFixture,
        error,
        isLoading,
        isError,
        isFetching,
        refetch
    };
};