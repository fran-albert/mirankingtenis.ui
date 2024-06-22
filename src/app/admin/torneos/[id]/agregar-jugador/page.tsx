"use client";
import { useUserStore } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import StepControllerForTournament from "@/sections/Admin/Tournament/Players/StepController";
import React, { useEffect } from "react";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";

function AddPlayerTournament() {
  const params = useParams();
  const idTournament = Number(params.id);
  const { getAllUsers, users, loading, error } = useUserStore();
  const { nonParticipants, findNonParticipants } =
    useTournamentParticipantStore();

  useEffect(() => {
    findNonParticipants(idTournament);
  }, [findNonParticipants, idTournament]);
  return (
    <div>
      <StepControllerForTournament
        users={nonParticipants}
        idTournament={idTournament}
      />
    </div>
  );
}

export default AddPlayerTournament;
