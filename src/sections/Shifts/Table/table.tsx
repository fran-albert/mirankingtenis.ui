import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { User } from "@/types/User/User";
import { getAllUsers } from "@/modules/users/application/get-all/getAllUsers";
import { getColumns } from "./columns";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getAllByDate } from "@/modules/match/application/get-by-date/getAllByDate";
import { Match } from "@/modules/match/domain/Match";
import { ShiftCalendar } from "../Calendar";

export const ShiftTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = useMemo(() => createApiMatchRepository(), []);
  const loadAllMatches = useMemo(
    () => getAllByDate(matchRepository),
    [matchRepository]
  );

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const matchData = await loadAllMatches();
        setMatches(matchData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [loadAllMatches]);

  const shiftsColumns = getColumns(matches.length);

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <>
      <DataTable
        columns={shiftsColumns}
        data={matches}
        searchPlaceholder="Buscar partido..."
        showSearch={false}
        addLinkPath="jugadores/agregar"
        searchColumn="user1.lastname"
        canAddUser={false}
      />
    </>
  );
};
