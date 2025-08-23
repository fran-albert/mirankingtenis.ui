"use client"
import { getAllCategories } from "@/api/Category/get-all-categories";
import { getTotalCategories } from "@/api/Category/get-total-categories";
import { useQuery } from "@tanstack/react-query";

interface UseCategoriesProps {
    enabled?: boolean;
}

export const useAllCategories = ({ enabled = true }: UseCategoriesProps = {}) => {
    const { isLoading, isError, error, data: categories = [], isFetching } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getAllCategories(),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled,
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

export const useTotalCategories = ({ enabled = true }: UseCategoriesProps = {}) => {
    const { isLoading, isError, error, data: total = 0, isFetching } = useQuery({
        queryKey: ['categories', 'total'],
        queryFn: () => getTotalCategories(),
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