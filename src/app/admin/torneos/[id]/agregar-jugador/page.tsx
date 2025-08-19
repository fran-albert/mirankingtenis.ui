"use client";
import { useUserStore } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import StepControllerForTournament from "@/sections/Admin/Tournament/Players/StepController";
import React from "react";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
import { useTournament } from "@/hooks/Tournament/useTournament";

function AddPlayerTournament() {
  const params = useParams();
  const idTournament = Number(params.id);
  
  // Usar React Query hook para obtener el torneo
  const { tournament, isLoading: isTournamentLoading } = useTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  
  // Mantener el hook de participantes (no migrado aún)
  const { nonParticipants, findNonParticipants } = useTournamentParticipantStore();

  // Solo llamar findNonParticipants cuando sea necesario
  React.useEffect(() => {
    if (idTournament) {
      findNonParticipants(idTournament);
    }
  }, [idTournament, findNonParticipants]);

  if (isTournamentLoading || !tournament) {
    return <div>Cargando torneo...</div>;
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
