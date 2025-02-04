import { getTotalPoints } from "@/api/User-Double-Express-Points-History/get-total-points";
import { useQuery } from "@tanstack/react-query";

interface Props {
  auth: boolean;
}

export const useUserDoubleExpressPointHistory = ({ auth }: Props) => {
  const {
    isLoading,
    isError,
    error,
    data: points,
  } = useQuery({
    queryKey: ["points"],
    queryFn: () => getTotalPoints(),
    staleTime: 1000 * 60,
    enabled: auth,
  });

  return {
    points,
    error,
    isLoading,
    isError,
  };
};
