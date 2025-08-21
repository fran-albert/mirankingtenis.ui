"use client"
import { getAdminUsers } from "@/api/Users/get-admin-users";
import { useQuery } from "@tanstack/react-query"

interface Props {
    auth: boolean;
    fetchUsers?: boolean;
}

export const useAdminUsers = ({ auth, fetchUsers = true }: Props) => {

    const { isLoading, isError, error, data: users = [], isFetching } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => getAdminUsers(),
        staleTime: 1000 * 60,
        enabled: auth && fetchUsers
    });

    return {
        users,
        error,
        isLoading,
        isError, 
        isFetching,
    }

}