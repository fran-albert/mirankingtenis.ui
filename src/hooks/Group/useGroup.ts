import { useQuery } from "@tanstack/react-query";
import { findAllByGroupStage } from "@/api/Group/findAllByGroupStage";
import { getGroupRankings } from "@/api/Group/getGroupRankings";
import { hasGroupsForCategory } from "@/api/Group/hasGroupForCategory";

export const useGroupsByStage = (groupStageId: number, enabled: boolean = true) => {
    const { isLoading, isError, error, data: groups = [], isFetching } = useQuery({
        queryKey: ['groups', 'byStage', groupStageId],
        queryFn: () => findAllByGroupStage(groupStageId),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!groupStageId
    });

    return {
        groups,
        error,
        isLoading,
        isError,
        isFetching
    };
};

export const useGroupRankings = (groupStageId: number, enabled: boolean = true) => {
    const { isLoading, isError, error, data: rankings = [], isFetching } = useQuery({
        queryKey: ['groups', 'rankings', groupStageId],
        queryFn: () => getGroupRankings(groupStageId),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!groupStageId
    });

    return {
        rankings,
        error,
        isLoading,
        isError,
        isFetching
    };
};

export const useHasGroupsForCategory = (idTournament: number, idCategory: number, enabled: boolean = true) => {
    const { isLoading, isError, error, data: hasGroups = false, isFetching } = useQuery({
        queryKey: ['groups', 'hasGroups', idTournament, idCategory],
        queryFn: () => hasGroupsForCategory(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory
    });

    return {
        hasGroups,
        error,
        isLoading,
        isError,
        isFetching
    };
};