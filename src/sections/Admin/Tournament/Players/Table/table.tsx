"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
function PlayersTournamentTable({ idTournament }: { idTournament: number }) {
  const {
    create,
    desactivatePlayer,
    error,
    getParticipantsByTournamentCategory,
    getPlayersByTournament,
    loading,
    tournamentParticipants,
  } = useTournamentParticipantStore();
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getPlayersByTournament(idTournament);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [idTournament, getPlayersByTournament]);

  const handlePlayerDesactivated = async (idPlayer: number) => {
    try {
      await desactivatePlayer(idPlayer, idTournament);
      await getPlayersByTournament(idTournament);
    } catch (error) {
      console.error("Error desactivando jugador", error);
    }
  };
  const playersColumns = getColumns(handlePlayerDesactivated, { isAdmin });
  const customFilterFunction = (player: TournamentParticipant, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase()) ||
    player.lastname.toLowerCase().includes(query.toLowerCase());

  return (
    <div>
      <DataTable
        columns={playersColumns}
        data={tournamentParticipants}
        searchPlaceholder="Buscar jugadores..."
        pageSizes={8}
        showSearch={true}
        addLinkPath={`/admin/torneos/${idTournament}/agregar-jugador`}
        customFilter={customFilterFunction}
        addLinkText="Inscribir Jugador"
        canAddUser={canAddUser}
      />
    </div>
  );
}

export default PlayersTournamentTable;
