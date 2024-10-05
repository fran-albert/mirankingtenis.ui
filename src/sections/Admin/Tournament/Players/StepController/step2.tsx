import React, { useState } from "react";
import SelectPlayerTournamentComponent from "../Add";
import { User } from "@/types/User/User";
import { Button } from "@/components/ui/button";
import { NonParticipantsDto } from "@/common/types/non-participants.dto";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  users: NonParticipantsDto[];
  onSelectedPlayersChange: (selectedPlayers: User[]) => void;
}

export const Step2 = ({
  onNext,
  users,
  onBack,
  onSelectedPlayersChange,
}: Step2Props) => {
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);

  const handleNext = () => {
    onSelectedPlayersChange(selectedPlayers);
    onNext();
  };

  return (
    <div>
      <SelectPlayerTournamentComponent
        users={users}
        onSelectedPlayersChange={setSelectedPlayers}
      />
      <div className="flex justify-center space-x-4 mt-6">
        <Button
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
