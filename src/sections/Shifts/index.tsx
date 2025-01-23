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

export const ShiftManagement = () => {
  const {MatchesByDate: matches, errorMatchesByDate, isLoadingMatchesByDate: isLoading} = useMatches({})
  if (isLoading) {
    return <Loading isLoading />;
  }

  return <ShiftCalendar matches={matches} />;
};
