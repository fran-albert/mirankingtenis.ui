"use client"
import { getUsersByCategory } from "@/api/Users/get-users-by-category";
import { useQuery } from "@tanstack/react-query"

interface Props {
    idCategory: number;
    enabled?: boolean;
}

export const useUsersByCategory = ({ idCategory, enabled = true }: Props) => {

    const { isLoading, isError, error, data: users = [], isFetching } = useQuery({
        queryKey: ['users-by-category', idCategory],
        queryFn: () => getUsersByCategory(idCategory),
        staleTime: 1000 * 60,
        enabled: enabled && !!idCategory
    });

    return {
        users,
        error,
        isLoading,
        isError, 
        isFetching,
    }

}