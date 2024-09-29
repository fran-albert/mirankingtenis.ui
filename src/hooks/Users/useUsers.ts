"use client"
import { getAllUsers } from "@/api/Users/get-all-users";
import { useQuery } from "@tanstack/react-query"

interface Props {
    auth: boolean;
    fetchUsers: boolean;
}

export const useUsers = ({ auth, fetchUsers }: Props) => {

    const { isLoading, isError, error, data: users = [], isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: () => getAllUsers(),
        staleTime: 1000 * 60,
        enabled: auth && fetchUsers
    });

    return {
        users,
        error,
        isLoading,
        isError, isFetching,
    }

}