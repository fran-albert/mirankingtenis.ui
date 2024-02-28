// import { getColumns } from "./columns";
import { useEffect, useState } from "react";
// import { createApiPatientRepository } from "@/modules/patients/infra/ApiPatientRepository";
// import { getAllPatients } from "@/modules/patients/application/get-all/getAllPatients";
// import { Patient } from "@/modules/patients/domain/Patient";
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
  const userRepository = createApiUserRepository();
  const loadAllPlayers = getAllUsers(userRepository);
  const { isPlayer, isAdmin } = useRoles();

  const { session } = useCustomSession();

  const canAddUser = !!session && isAdmin;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await loadAllPlayers();
      setPlayers(userData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playersColumns = getColumns(fetchUsers, { isAdmin });

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return <Loading isLoading />;
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
        searchColumn="name"
        addLinkText="Agregar Jugador"
        canAddUser={canAddUser}
      />
    </>
  );
};
