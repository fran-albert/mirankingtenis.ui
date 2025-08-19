import Loading from "@/components/Loading/loading";
import { ShiftCalendar } from "./Calendar";
import { useMatchesByDate } from "@/hooks/Matches/useMatches";
import { useUsers } from "@/hooks/Users/useUsers";
import { useDoublesMatches } from "@/hooks/Doubles-Express/useDoublesMatches";

export const ShiftManagement = () => {
  const { data: matches = [], error: errorMatchesByDate, isLoading } = useMatchesByDate();
  const { doublesMatches, isLoading: isLoadingDoubleMatches } =
    useDoublesMatches({ auth: true, fetchMatches: true });
  const { isLoading: isLoadingUsers, users } = useUsers({
    auth: true,
    fetchUsers: true,
  });
  if (isLoading || isLoadingUsers || isLoadingDoubleMatches) {
    return <Loading isLoading />;
  }

  return (
    <ShiftCalendar
      matches={matches}
      players={users}
      doublesMatches={doublesMatches}
    />
  );
};
