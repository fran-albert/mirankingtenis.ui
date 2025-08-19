import { User } from "@/types/User/User";
import React, { useEffect, useState } from "react";
import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { Step5 } from "./step5";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NonParticipantsDto } from "@/common/types/non-participants.dto";
import { Tournament } from "@/types/Tournament/Tournament";

function StepControllerForTournament({
  users,
  idTournament,
  tournament,
}: {
  users: NonParticipantsDto[];
  tournament: Tournament | null;
  idTournament: number;
}) {
  const router = useRouter();
  const { create } = useTournamentParticipantStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [playerPositions, setPlayerPositions] = useState<
    {
      playerId: number;
      position: string | null;
      isDirectlyQualified: boolean;
    }[]
  >([]);

  const handleCategorySelect = (idCategory: number) => {
    setSelectedCategoryId(idCategory);
  };

  const handlePlayerPositionsChange = (
    positions: {
      playerId: number;
      position: string | null;
      isDirectlyQualified: boolean;
    }[]
  ) => {
    setPlayerPositions(positions);
  };

  const handleSubmit = async () => {
    const payload = {
      tournamentId: idTournament,
      categoryId: selectedCategoryId,
      userIds: selectedPlayers.map((player) => player.id),
      positionInitials: playerPositions
        .map((position) =>
          position.position !== null ? parseInt(position.position, 10) : null
        )
        .filter((position) => position !== null) as number[],
      isDirectlyQualified: playerPositions.map(
        (position) => position.isDirectlyQualified
      ),
    };
    try {
      const createPromise = create(
        payload.tournamentId,
        payload.categoryId,
        payload.userIds,
        payload.positionInitials,
        payload.isDirectlyQualified
      );

      toast.promise(createPromise, {
        loading: "Enviando datos...",
        success: "Participantes agregados con éxito!",
        error: "Error al agregar participantes",
      });

      const response = await createPromise;
      router.push(`/admin/torneos/${idTournament}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al agregar participantes");
    }
  };

  const handleSelectedPlayersChange = (players: User[]) => {
    setSelectedPlayers(players);
  };

  switch (currentStep) {
    case 1:
      return (
        <Step1 onNext={nextStep} onCategorySelect={handleCategorySelect} />
      );
    case 2:
      return (
        <Step2
          onNext={nextStep}
          onBack={previousStep}
          users={users}
          onSelectedPlayersChange={handleSelectedPlayersChange}
        />
      );
    case 3:
      return (
        <Step3
          onBack={previousStep}
          tournament={tournament}
          onNext={nextStep}
          selectedPlayers={selectedPlayers}
          onPlayerPositionsChange={handlePlayerPositionsChange}
        />
      );
    case 4:
      return (
        <Step4
          onBack={previousStep}
          tournament={tournament}
          onNext={nextStep}
          playerPositions={playerPositions}
          selectedPlayers={selectedPlayers}
        />
      );
    case 5:
      return (
        <Step5
          onBack={previousStep}
          tournament={tournament}
          onSubmit={handleSubmit}
          tournamentId={idTournament}
          categoryId={selectedCategoryId}
          selectedPlayers={selectedPlayers}
          playerPositions={playerPositions}
        />
      );
    default:
      return <div>Error: Unknown Step</div>;
  }
}

export default StepControllerForTournament;
