import { getAllDoubleExhibitionMatch } from "@/api/Doubles-Express/findAll";
import { useQuery } from "@tanstack/react-query"

interface Props {
    auth: boolean;
    fetchMatches: boolean;
}
export const useDoublesMatches = ({ auth, fetchMatches }: Props) => {

    const { isLoading, isError, error, data: doublesMatches = [], isFetching } = useQuery({
        queryKey: ['doublesMatches'],
        queryFn: () => getAllDoubleExhibitionMatch(),
        staleTime: 1000 * 60,
        enabled: auth && fetchMatches
    });


    return {
        doublesMatches,
        error,
        isLoading,
        isError, isFetching,

    }

}