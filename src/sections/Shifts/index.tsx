import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { User } from "@/types/User/User";
import { getAllUsers } from "@/modules/users/application/get-all/getAllUsers";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getAllByDate } from "@/modules/match/application/get-by-date/getAllByDate";
import { Match } from "@/modules/match/domain/Match";
import { ShiftCalendar } from "./Calendar";
import { useMatches } from "@/hooks/Matches/useMatches";
import { useUser } from "@/hooks/Users/useUser";
import { useUsers } from "@/hooks/Users/useUsers";
import { useDoublesMatches } from "@/hooks/Doubles-Express/useDoublesMatches";

export const ShiftManagement = () => {
  const {
    MatchesByDate: matches,
    errorMatchesByDate,
    isLoadingMatchesByDate: isLoading,
  } = useMatches({});
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
