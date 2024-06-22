// StepsController.js
"use client";
import React, { useEffect, useState } from "react";

import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { Step5 } from "./step5";
import { createApiTournamentParticipantRepository } from "@/modules/tournament-participant/infra/ApiTournamentRepository";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { createApiTournamentRankingRepository } from "@/modules/tournament-ranking/infra/ApiTournamentRankingRepository";
import { TournamentRanking } from "@/modules/tournament-ranking/domain/TournamentRanking";

export const StepsControllerV2 = ({
  idTournament,
  idCategory,
  tournamentCategoryId,
  nextMatchDay,
}: {
  idTournament: number;
  nextMatchDay: number;
  tournamentCategoryId: number;
  idCategory: number;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedTournamentId, setSelectedTournamentId] = useState(0);
  const [selectedJornada, setSelectedJornada] = useState("");
  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);
  const [selectedMatches, setSelectedMatches] = useState<
    { idUser1: number | null; idUser2: number | null }[]
  >([]);
  const [players, setPlayers] = useState<TournamentRanking[]>([]);

  useEffect(() => {
    if (idCategory) {
      const userRepository = createApiTournamentRankingRepository();
      userRepository
        .getAllRankingsByTournamentCategory(idTournament, idCategory)
        .then(setPlayers)
        .catch((error) => console.error("Error fetching players:", error));
    }
  }, [idCategory, idTournament]);


  switch (currentStep) {
    case 1:
      return (
        <Step4
          onNext={nextStep}
          idCategory={idCategory}
          onMatchesSelect={setSelectedMatches}
          players={players}
        />
      );
    case 2:
      return (
        <Step5
          onBack={previousStep}
          selectedTournamentId={idTournament}
          selectedCategoryId={idCategory}
          selectedJornada={String(nextMatchDay)}
          tournamentCategoryId={tournamentCategoryId}
          selectedMatches={selectedMatches}
          players={players}
        />
      );

    default:
      return <div>Error: Unknown Step</div>;
  }
};
