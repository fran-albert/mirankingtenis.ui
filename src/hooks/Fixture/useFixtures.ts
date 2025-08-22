"use client"
import { getFixtureByCategory } from "@/api/Fixture/get-fixture-by-category";
import { getCountFixturesByTournamentCategory } from "@/api/Fixture/get-count-fixtures-by-tournament-category";
import { countFixturesByCategory } from "@/api/Fixture/count-fixtures-by-category";
import { isGroupStageFixturesCreated } from "@/api/Fixture/is-group-stage-fixtures-created";
import { getSemiFinals } from "@/api/Fixture/get-semi-finals";
import { getQuarterFinals } from "@/api/Fixture/get-quarter-finals";
import { getFinals } from "@/api/Fixture/get-finals";
import { useQuery } from "@tanstack/react-query"

interface UseFixturesByCategoryProps {
    idCategory: number;
    enabled?: boolean;
}

export const useFixturesByCategory = ({ idCategory, enabled = true }: UseFixturesByCategoryProps) => {
    const { isLoading, isError, error, data: fixtures = [], isFetching } = useQuery({
        queryKey: ['fixtures', 'category', idCategory],
        queryFn: () => getFixtureByCategory(idCategory),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: enabled && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        fixtures,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseFixtureCountProps {
    idCategory: number;
    idTournament: number;
    enabled?: boolean;
}

export const useFixtureCountByTournamentCategory = ({ idCategory, idTournament, enabled = true }: UseFixtureCountProps) => {
    const { isLoading, isError, error, data: count = 0, isFetching } = useQuery({
        queryKey: ['fixtures', 'count', 'tournament-category', idCategory, idTournament],
        queryFn: () => getCountFixturesByTournamentCategory(idCategory, idTournament),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idCategory && !!idTournament,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        count,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useFixtureCountByCategory = ({ idCategory, enabled = true }: UseFixturesByCategoryProps) => {
    const { isLoading, isError, error, data: count = 0, isFetching } = useQuery({
        queryKey: ['fixtures', 'count', 'category', idCategory],
        queryFn: () => countFixturesByCategory(idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        count,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseGroupStageFixturesCreatedProps {
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useIsGroupStageFixturesCreated = ({ idTournament, idCategory, enabled = true }: UseGroupStageFixturesCreatedProps) => {
    const { isLoading, isError, error, data: isCreated = false, isFetching } = useQuery({
        queryKey: ['fixtures', 'group-stage-created', idTournament, idCategory],
        queryFn: () => isGroupStageFixturesCreated(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        isCreated,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UsePlayoffMatchesProps {
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useSemiFinals = ({ idTournament, idCategory, enabled = true }: UsePlayoffMatchesProps) => {
    const { isLoading, isError, error, data: matches = [], isFetching } = useQuery({
        queryKey: ['fixtures', 'semi-finals', idTournament, idCategory],
        queryFn: () => getSemiFinals(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        matches,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useQuarterFinals = ({ idTournament, idCategory, enabled = true }: UsePlayoffMatchesProps) => {
    const { isLoading, isError, error, data: matches = [], isFetching } = useQuery({
        queryKey: ['fixtures', 'quarter-finals', idTournament, idCategory],
        queryFn: () => getQuarterFinals(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        matches,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useFinals = ({ idTournament, idCategory, enabled = true }: UsePlayoffMatchesProps) => {
    const { isLoading, isError, error, data: matches = [], isFetching } = useQuery({
        queryKey: ['fixtures', 'finals', idTournament, idCategory],
        queryFn: () => getFinals(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        matches,
        error,
        isLoading,
        isError,
        isFetching,
    }
}