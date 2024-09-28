"use client"
import { getAllMatches } from "@/api/Matches/get-all-matches";
import { getMatchesByDate } from "@/api/Matches/get-matches-by-date";
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