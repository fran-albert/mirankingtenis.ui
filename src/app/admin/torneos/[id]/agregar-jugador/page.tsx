"use client";
import { useUserStore } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import StepControllerForTournament from "@/sections/Admin/Tournament/Players/StepController";
import React, { useEffect } from "react";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
import { useTournamentStore } from "@/hooks/useTournament";

function AddPlayerTournament() {
  const params = useParams();
  const idTournament = Number(params.id);
  const { tournament, getTournament } = useTournamentStore();
  const { nonParticipants, findNonParticipants } =
    useTournamentParticipantStore();

  useEffect(() => {
    findNonParticipants(idTournament);
    getTournament(idTournament);
  }, [findNonParticipants, idTournament]);

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
