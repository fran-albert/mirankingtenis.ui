import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { getAllUsers } from "@/modules/users/application/get-all/getAllUsers";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";

export const PlayersTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<User[]>([]);
  const userRepository = useMemo(() => createApiUserRepository(), []);
  const loadAllPlayers = useCallback(async () => {
    const users = await getAllUsers(userRepository)();
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

  const playersColumns = getColumns(handlePlayerDeleted, { isAdmin });

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
        data={players}
        searchPlaceholder="Buscar jugadores..."
        showSearch={true}
        addLinkPath="jugadores/agregar"
        customFilter={customFilterFunction}
        addLinkText="Agregar Jugador"
        canAddUser={canAddUser}
      />
    </>
  );
};
