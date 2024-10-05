// StepsController.js
"use client";
import React, { useEffect, useState } from "react";

import { User } from "@/types/User/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { createApiTournamentParticipantRepository } from "@/modules/tournament-participant/infra/ApiTournamentRepository";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { createApiTournamentRankingRepository } from "@/modules/tournament-ranking/infra/ApiTournamentRankingRepository";
import { TournamentRanking } from "@/modules/tournament-ranking/domain/TournamentRanking";
import { useGroupStore } from "@/hooks/useGroup";
import { Step4 } from "../step4";
import { Step5 } from "../step5";
import { GroupRankingDto } from "@/common/types/group-ranking.dto";
import { Step1Groups } from "./step1";
import { Step2Group } from "./step2";

export const StepsControllerGroup = ({
  idTournament,
  idCategory,
  nextMatchDay,
  tournamentCategoryId,
  groupRankings,
}: {
  idTournament: number;
  tournamentCategoryId: number;
  nextMatchDay: number;
  idCategory: number;
  groupRankings: GroupRankingDto[];
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);
  const [selectedMatches, setSelectedMatches] = useState<
    { idUser1: number | null; idUser2: number | null }[]
  >([]);

  switch (currentStep) {
    case 1:
      return (
        <Step1Groups
          onNext={nextStep}
          idCategory={idCategory}
          onMatchesSelect={setSelectedMatches}
          groupRankings={groupRankings}
        />
      );
    case 2:
      return (
        <Step2Group
          onBack={previousStep}
          selectedTournamentId={idTournament}
          selectedCategoryId={idCategory}
          selectedJornada={String(nextMatchDay)}
          tournamentCategoryId={tournamentCategoryId}
          selectedMatches={selectedMatches}
          groupRankings={groupRankings}
        />
      );

    default:
      return <div>Error: Unknown Step</div>;
  }
};
