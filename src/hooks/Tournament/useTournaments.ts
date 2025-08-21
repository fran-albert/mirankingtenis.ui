"use client"
import { getAllTournaments } from "@/api/Tournament/get-all-tournaments";
import { getTournament } from "@/api/Tournament/get-tournament";
import { getAllTournamentsByPlayer } from "@/api/Tournament/get-all-tournaments-by-player";
import { getCurrentTournamentByPlayer } from "@/api/Tournament/get-current-tournament-by-player";
import { getLastTournamentByPlayer } from "@/api/Tournament/get-last-tournament-by-player";
import { getCompletedTournamentsByPlayer } from "@/api/Tournament/get-completed-tournaments-by-player";
import { getPlayerInfo } from "@/api/Tournament/get-player-info";
import { isCurrentTournament } from "@/api/Tournament/is-current-tournament";
import { findLastFinishedLeagueTournament } from "@/api/Tournament/find-last-finished-league-tournament";
import { getTotalTournaments } from "@/api/Tournament/get-total-tournaments";
import { useQuery } from "@tanstack/react-query"

interface UseAllTournamentsProps {
    enabled?: boolean;
}

export const useAllTournaments = ({ enabled = true }: UseAllTournamentsProps = {}) => {
    const { isLoading, isError, error, data: tournaments = [], isFetching } = useQuery({
        queryKey: ['tournaments'],
        queryFn: () => getAllTournaments(),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournaments,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseTournamentProps {
    idTournament: number;
    enabled?: boolean;
}

export const useTournament = ({ idTournament, enabled = true }: UseTournamentProps) => {
    const { isLoading, isError, error, data: tournament, isFetching } = useQuery({
        queryKey: ['tournament', idTournament],
        queryFn: () => getTournament(idTournament),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournament,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseTournamentsByPlayerProps {
    idPlayer: number;
    enabled?: boolean;
}

export const useAllTournamentsByPlayer = ({ idPlayer, enabled = true }: UseTournamentsByPlayerProps) => {
    const { isLoading, isError, error, data: tournaments = [], isFetching } = useQuery({
        queryKey: ['tournaments', 'player', idPlayer],
        queryFn: () => getAllTournamentsByPlayer(idPlayer),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idPlayer,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournaments,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useCurrentTournamentByPlayer = ({ idPlayer, enabled = true }: UseTournamentsByPlayerProps) => {
    const { isLoading, isError, error, data: tournament, isFetching } = useQuery({
        queryKey: ['tournament', 'current', 'player', idPlayer],
        queryFn: () => getCurrentTournamentByPlayer(idPlayer),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idPlayer,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournament,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useLastTournamentByPlayer = ({ idPlayer, enabled = true }: UseTournamentsByPlayerProps) => {
    const { isLoading, isError, error, data: tournament, isFetching } = useQuery({
        queryKey: ['tournament', 'last', 'player', idPlayer],
        queryFn: () => getLastTournamentByPlayer(idPlayer),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idPlayer,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournament,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useCompletedTournamentsByPlayer = ({ idPlayer, enabled = true }: UseTournamentsByPlayerProps) => {
    const { isLoading, isError, error, data: tournaments = [], isFetching } = useQuery({
        queryKey: ['tournaments', 'completed', 'player', idPlayer],
        queryFn: () => getCompletedTournamentsByPlayer(idPlayer),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: enabled && !!idPlayer,
        retry: (failureCount, error: any) => {
            // No reintentar si es 404 (endpoint no existe)
            if (error?.response?.status === 404) return false;
            // Solo 1 reintento para otros errores
            return failureCount < 1;
        },
        retryDelay: 1000, // 1 segundo entre reintentos
    });

    return {
        tournaments,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UsePlayerInfoProps {
    idTournament: number;
    idPlayer: number;
    enabled?: boolean;
}

export const usePlayerInfo = ({ idTournament, idPlayer, enabled = true }: UsePlayerInfoProps) => {
    const { isLoading, isError, error, data: playerInfo, isFetching } = useQuery({
        queryKey: ['playerInfo', idTournament, idPlayer],
        queryFn: () => getPlayerInfo(idTournament, idPlayer),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idPlayer,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        playerInfo,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useIsCurrentTournament = ({ idTournament, enabled = true }: UseTournamentProps) => {
    const { isLoading, isError, error, data: isCurrent, isFetching } = useQuery({
        queryKey: ['tournament', 'isCurrent', idTournament],
        queryFn: () => isCurrentTournament(idTournament),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        isCurrent,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useLastFinishedLeagueTournament = ({ enabled = true }: UseAllTournamentsProps = {}) => {
    const { isLoading, isError, error, data: tournament, isFetching } = useQuery({
        queryKey: ['tournament', 'lastFinishedLeague'],
        queryFn: () => findLastFinishedLeagueTournament(),
        staleTime: 1000 * 60 * 5,
        enabled,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournament,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

export const useTotalTournaments = ({ enabled = true }: UseAllTournamentsProps = {}) => {
    const { isLoading, isError, error, data: total = 0, isFetching } = useQuery({
        queryKey: ['tournaments', 'total'],
        queryFn: () => getTotalTournaments(),
        staleTime: 1000 * 60 * 5,
        enabled,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        total,
        error,
        isLoading,
        isError,
        isFetching,
    }
}