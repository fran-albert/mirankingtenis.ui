"use client";
import { useParams } from "next/navigation";
import StepControllerForTournament from "@/sections/Admin/Tournament/Players/StepController";
import React from "react";
import { useNonParticipants } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { useTournament } from "@/hooks/Tournament/useTournament";

function AddPlayerTournament() {
  const params = useParams();
  const idTournament = Number(params.id);
  
  // Usar React Query hook para obtener el torneo
  const { tournament, isLoading: isTournamentLoading } = useTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  
  // Usar React Query hook para obtener no participantes
  const { data: nonParticipants = [], isLoading: isNonParticipantsLoading } = useNonParticipants(idTournament, !!idTournament);

  if (isTournamentLoading || isNonParticipantsLoading || !tournament) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <StepControllerForTournament
        users={nonParticipants}
        tournament={tournament}
        idTournament={idTournament}
      />
    </div>
  );
}

export default AddPlayerTournament;
