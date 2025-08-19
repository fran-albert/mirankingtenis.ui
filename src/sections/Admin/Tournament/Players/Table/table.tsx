"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { usePlayersByTournament, useDesactivatePlayer } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { ColumnDef } from "@tanstack/react-table";
function PlayersTournamentTable({ idTournament }: { idTournament: number }) {
  // Usar React Query hooks
  const { data: tournamentParticipants = [], isLoading: loading } = usePlayersByTournament(idTournament, !!idTournament);
  const desactivatePlayerMutation = useDesactivatePlayer();
  
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  const handlePlayerDesactivated = async (idPlayer: number) => {
    try {
      await desactivatePlayerMutation.mutateAsync({ idPlayer, tournamentId: idTournament });
      // React Query invalidará automáticamente las queries relacionadas
    } catch (error) {
      console.error("Error desactivando jugador", error);
    }
  };
  const playersColumns: ColumnDef<TournamentParticipant>[] = getColumns(handlePlayerDesactivated, { isAdmin });
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
