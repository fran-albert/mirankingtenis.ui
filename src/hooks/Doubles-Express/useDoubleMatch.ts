import { getDoubleExhibitionMatch } from "@/api/Doubles-Express/findOne";
import { useQuery } from "@tanstack/react-query"

interface Props {
    auth: boolean;
    id: number
}

export const useDoubleMatch = ({ auth, id }: Props) => {

    const { isLoading, isError, error, data: doubleMatch, isFetching } = useQuery({
        queryKey: ['doubleMatch', id],
        queryFn: () => getDoubleExhibitionMatch(id),
        staleTime: 1000 * 60,
        enabled: auth && id !== undefined,
    });


    return {
        doubleMatch,
        error,
        isLoading,
        isError, isFetching,
    }

}