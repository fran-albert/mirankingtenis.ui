import { getTotalPoints } from "@/api/User-Double-Express-Points-History/get-total-points";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  auth: boolean;
  id?: number;
}

export const useUserDoubleExpressPointHistory = ({ auth, id }: Props) => {
  const {
    isLoading,
    isError,
    error,
    data: points,
  } = useQuery({
    queryKey: ["points"],
    queryFn: () => getTotalPoints(),
    staleTime: 1000 * 60,
    enabled: auth && id !== undefined,
  });

  return {
    points,
    error,
    isLoading,
    isError,
  };
};
