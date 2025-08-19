"use client"
import { getTournamentCategoryId } from "@/api/Tournament-Category/get-tournament-category-id";
import { getTournamentCategoriesByUser } from "@/api/Tournament-Category/get-tournament-categories-by-user";
import { getCategoriesForTournament } from "@/api/Tournament-Category/get-categories-for-tournament";
import { useQuery } from "@tanstack/react-query"

interface UseTournamentCategoryIdProps {
    idTournament: number;
    idCategory: number;
    enabled?: boolean;
}

export const useTournamentCategoryId = ({ idTournament, idCategory, enabled = true }: UseTournamentCategoryIdProps) => {
    const { isLoading, isError, error, data: tournamentCategoryId, isFetching } = useQuery({
        queryKey: ['tournamentCategoryId', idTournament, idCategory],
        queryFn: () => getTournamentCategoryId(idTournament, idCategory),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament && !!idCategory,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        tournamentCategoryId,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseTournamentCategoriesByUserProps {
    idUser: number;
    enabled?: boolean;
}

export const useTournamentCategoriesByUser = ({ idUser, enabled = true }: UseTournamentCategoriesByUserProps) => {
    const { isLoading, isError, error, data: categoriesForTournaments = [], isFetching } = useQuery({
        queryKey: ['tournamentCategories', 'user', idUser],
        queryFn: () => getTournamentCategoriesByUser(idUser),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idUser,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        categoriesForTournaments,
        error,
        isLoading,
        isError,
        isFetching,
    }
}

interface UseCategoriesForTournamentProps {
    idTournament: number;
    enabled?: boolean;
}

export const useCategoriesForTournament = ({ idTournament, enabled = true }: UseCategoriesForTournamentProps) => {
    const { isLoading, isError, error, data: categories = [], isFetching } = useQuery({
        queryKey: ['categories', 'tournament', idTournament],
        queryFn: () => getCategoriesForTournament(idTournament),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!idTournament,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
        retryDelay: 1000,
    });

    return {
        categories,
        error,
        isLoading,
        isError,
        isFetching,
    }
}