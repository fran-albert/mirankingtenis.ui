import { getGroupStagesByTournamentCategory } from "@/api/Group-Stage/getGroupStagesByTournamentCategory";
import { useQuery } from "@tanstack/react-query";

export const useGroupsStageByTournamentCategory = (idTournament: number, idCategory: number, enabled: boolean = true) => {
    const { isLoading, isError, error, data: groups, isFetching } = useQuery({
        queryKey: ['groupsStage', idTournament, idCategory],
        queryFn: () => getGroupStagesByTournamentCategory(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        groups,
        error,
        isLoading,
        isError,
        isFetching
    };
};
