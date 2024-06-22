"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { useUserStore } from "@/hooks/useUser";
import { getAdminUsers } from "@/modules/users/application/get-all-admin/getAdminUsers";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function AdminPlayersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { adminUsers, getAdminUsers, loading: isLoadingUsers} = useUserStore();  
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
   getAdminUsers();
  }, [getAdminUsers]);

  // const handlePlayerDeleted = (idPlayer: number) => {
  //   setPlayers((currentPlayers) =>
  //     currentPlayers.filter((player) => player.id !== idPlayer)
  //   );
  // };

  // const playersColumns = getColumns(handlePlayerDeleted, { isAdmin });

  // const customFilterFunction = (player: User, query: string) =>
  //   player.name.toLowerCase().includes(query.toLowerCase()) ||
  //   player.lastname.toLowerCase().includes(query.toLowerCase());

  if (isLoadingUsers) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <AdminPlayersTanstackTable players={adminUsers} />
    </div>
  );
}

export default AdminPlayersPage;
