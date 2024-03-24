import { useEffect, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { User } from "@/modules/users/domain/User";
import { getAllUsers } from "@/modules/users/application/get-all/getAllUsers";
import { getColumns } from "./columns";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getAllByDate } from "@/modules/match/application/get-by-date/getAllByDate";
import { Match } from "@/modules/match/domain/Match";

export const ShiftTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = createApiMatchRepository();
  const loadAllMatches = getAllByDate(matchRepository);

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

  const shiftsColumns = getColumns(matches.length);

  useEffect(() => {
    fetchMatches();
  }, []);

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <>
      <h1 className="text-2xl text-center font-medium mb-4">Lista de Turnos</h1>
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
