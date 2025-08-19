"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { useAllTournaments } from "@/hooks/Tournament/useTournament";
import { Tournament } from "@/types/Tournament/Tournament";
import TournamentTable from "@/sections/Admin/Tournament/Table/table";
import React, { useState, useEffect } from "react";

function TournamentPage() {
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;
  
  // Usar React Query hook para torneos
  const { tournaments, isLoading } = useAllTournaments();
  
  // Estado local para manejar actualizaciones de la tabla
  const [localTournaments, setLocalTournaments] = useState<Tournament[]>([]);
  
  // Inicializar local tournaments cuando lleguen los datos de React Query
  useEffect(() => {
    if (tournaments.length > 0 && localTournaments.length === 0) {
      setLocalTournaments(tournaments);
    }
  }, [tournaments, localTournaments.length]);

  // Usar la data de React Query, con fallback a estado local para actualizaciones optimistas
  const displayTournaments = localTournaments.length > 0 ? localTournaments : tournaments;

  const addTournamentToList = (newTournament: Tournament) => {
    setLocalTournaments((currentTournaments) => [
      ...currentTournaments,
      newTournament,
    ]);
  };

  const updateTournamentOnList = (updatedTournament: Tournament) => {
    setLocalTournaments((currentTournaments) =>
      currentTournaments.map((tournament) =>
        tournament.id === updatedTournament.id ? updatedTournament : tournament
      )
    );
  };

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <TournamentTable
        tournament={displayTournaments}
        addTournamentToList={addTournamentToList}
        onUpdateTournamentOnList={updateTournamentOnList}
      />
    </div>
  );
}

export default TournamentPage;
