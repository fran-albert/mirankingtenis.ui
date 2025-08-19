// StepsController.js
"use client";
import React, { useEffect, useState } from "react";

import { User } from "@/types/User/User";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { Step5 } from "./step5";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { TournamentRanking } from "@/modules/tournament-ranking/domain/TournamentRanking";
import { useTournamentRanking } from "@/hooks/Tournament-Ranking/useTournamentRanking";

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
  // Usar React Query hook para rankings
  const { rankings: players = [] } = useTournamentRanking({
    idTournament,
    idCategory,
    enabled: !!idTournament && !!idCategory
  });


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
