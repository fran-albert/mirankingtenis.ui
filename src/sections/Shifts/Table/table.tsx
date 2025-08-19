import React from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { useMatchesByDate } from "@/hooks/Matches/useMatches";

export const ShiftTable = () => {
  // Usar React Query hooks
  const { data: matches = [], isLoading: isLoadingMatches } =
    useMatchesByDate();

  // React Query maneja automáticamente la carga de datos

  const shiftsColumns = getColumns(matches.length);
  const isLoading = isLoadingMatches;

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
