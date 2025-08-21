import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { User } from "@/types/User/User";
import { getAllUsers } from "@/api/Users/get-all-users";
import { useUsers } from "@/hooks/Users/useUsers";

export const PlayersTable = () => {
  const { error, isLoading, users } = useUsers({
    auth: true,
    fetchUsers: true,
  })

  const playersColumns = getColumns();

  const customFilterFunction = (player: User, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase()) ||
    player.lastname.toLowerCase().includes(query.toLowerCase());

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <>
      <h1 className="text-2xl text-center font-medium mb-4">
        Lista de Jugadores
      </h1>
      <DataTable
        columns={playersColumns}
        data={users}
        searchPlaceholder="Buscar jugadores..."
        showSearch={true}
        addLinkPath="jugadores/agregar"
        customFilter={customFilterFunction}
        addLinkText="Agregar Jugador"
        canAddUser={false}
      />
    </>
  );
};
