import { getAllDoubleExhibitionMatch } from "@/api/Doubles-Express/findAll";
import { useQuery } from "@tanstack/react-query"

interface Props {
    auth: boolean;
    fetchMatches: boolean;
}
export const useDoublesMatches = ({ auth, fetchMatches }: Props) => {

    const { isLoading, isError, error, data: doublesMatches = [], isFetching } = useQuery({
        queryKey: ['doublesMatches'],
        queryFn: async () => {
            try {
                return await getAllDoubleExhibitionMatch();
            } catch (error: any) {
                // Si el endpoint no existe (404), devolver array vacío
                if (error?.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        staleTime: 1000 * 60,
        enabled: auth && fetchMatches,
        retry: (failureCount, error: any) => {
            // No reintentar si es 404
            if (error?.response?.status === 404) return false;
            return failureCount < 1;
        },
    });


    return {
        doublesMatches,
        error,
        isLoading,
        isError, isFetching,

    }

}