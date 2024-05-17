"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { getAdminUsers } from "@/modules/users/application/get-all-admin/getAdminUsers";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function AdminPlayersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<User[]>([]);
  const userRepository = useMemo(() => createApiUserRepository(), []);
  const loadAllPlayers = useCallback(async () => {
    const users = await getAdminUsers(userRepository)();
    return users;
  }, [userRepository]);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const userData = await loadAllPlayers();
        setPlayers(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [loadAllPlayers]);

  const handlePlayerDeleted = (idPlayer: number) => {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== idPlayer)
    );
  };

  // const playersColumns = getColumns(handlePlayerDeleted, { isAdmin });

  // const customFilterFunction = (player: User, query: string) =>
  //   player.name.toLowerCase().includes(query.toLowerCase()) ||
  //   player.lastname.toLowerCase().includes(query.toLowerCase());

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <AdminPlayersTanstackTable players={players} />
    </div>
  );
}

export default AdminPlayersPage;
