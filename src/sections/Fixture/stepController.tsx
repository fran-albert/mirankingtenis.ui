// StepsController.js
"use client";
import React, { useEffect, useState } from "react";
import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";

export const StepsController = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedJornada, setSelectedJornada] = useState("");
  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);
  const [selectedMatches, setSelectedMatches] = useState<
    { idUser1: number | null; idUser2: number | null }[]
  >([]);
  const [players, setPlayers] = useState<User[]>([]);

  const handleCategorySelect = (idCategory: number) => {
    setSelectedCategoryId(idCategory);
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const userRepository = createApiUserRepository();
      userRepository
        .getUsersByCategory(selectedCategoryId)
        .then(setPlayers)
        .catch((error) => console.error("Error fetching players:", error));
    }
  }, [selectedCategoryId]);

  const handleJornadaSelect = (jornada: string) => {
    setSelectedJornada(jornada);
  };

  switch (currentStep) {
    case 1:
      return (
        <Step1 onNext={nextStep} onCategorySelect={handleCategorySelect} />
      );
    case 2:
      return (
        <Step2
          onBack={previousStep}
          onNext={nextStep}
          onJornadaSelect={handleJornadaSelect}
        />
      );
    case 3:
      return (
        <Step3
          onBack={previousStep}
          onNext={nextStep}
          idCategory={selectedCategoryId}
          onMatchesSelect={setSelectedMatches}
          players={players}
        />
      );
    case 4:
      return (
        <Step4
          onBack={previousStep}
          onSubmit={() => console.log("Submit")}
          selectedCategoryId={selectedCategoryId}
          selectedJornada={selectedJornada}
          selectedMatches={selectedMatches}
          players={players}
        />
      );
    default:
      return <div>Error: Unknown Step</div>;
  }
};
