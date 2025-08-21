"use client"
import { getTotalUsers } from "@/api/Users/get-total-users";
import { useQuery } from "@tanstack/react-query"

interface Props {
    enabled?: boolean;
}

export const useTotalUsers = ({ enabled = true }: Props) => {

    const { isLoading, isError, error, data: totalUsers = 0, isFetching } = useQuery({
        queryKey: ['total-users'],
        queryFn: () => getTotalUsers(),
        staleTime: 1000 * 60,
        enabled: enabled
    });

    return {
        totalUsers,
        error,
        isLoading,
        isError, 
        isFetching,
    }

}