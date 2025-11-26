"use client";
import React, { useEffect } from "react";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { TournamentParticipant } from "@/types/Tournament-Participant/TournamentParticipant";
import { usePlayersByTournament, useDesactivatePlayer } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { ColumnDef } from "@tanstack/react-table";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface PlayersTournamentTableProps {
  idTournament: number;
  categories?: TournamentCategory[];
}

function PlayersTournamentTable({ idTournament, categories = [] }: PlayersTournamentTableProps) {
  // Usar React Query hooks
  const { data: tournamentParticipants = [], isLoading: loading } = usePlayersByTournament(idTournament, !!idTournament);
  const desactivatePlayerMutation = useDesactivatePlayer();
  
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  // Detectar si todas las categorías son skipGroupStage (direct to playoffs)
  const allCategoriesAreDirectPlayoffs = categories.length > 0 && categories.every(cat => cat.skipGroupStage);

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
    <div className="space-y-4">
      {allCategoriesAreDirectPlayoffs && canAddUser && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Inscripción de Jugadores para Playoffs Directos</strong>
            <p className="mt-1 text-sm">
              Este torneo tiene categorías que van directamente a playoffs.
              Usa la sección <strong>&quot;Inscripción Rápida - Playoffs Directos&quot;</strong> arriba
              para inscribir jugadores con validación automática del número correcto de participantes.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={playersColumns}
        data={tournamentParticipants}
        searchPlaceholder="Buscar jugadores..."
        pageSizes={8}
        showSearch={true}
        addLinkPath={allCategoriesAreDirectPlayoffs ? undefined : `/admin/torneos/${idTournament}/agregar-jugador`}
        customFilter={customFilterFunction}
        addLinkText="Inscribir Jugador"
        canAddUser={canAddUser && !allCategoriesAreDirectPlayoffs}
      />
    </div>
  );
}

export default PlayersTournamentTable;
