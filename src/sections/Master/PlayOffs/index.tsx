import React, { useState } from "react";
import { useRoundOf16, useQuarterFinals, useSemifinals, useFinals, usePlayoffStageStatus } from "@/hooks/PlayOff/usePlayOff";
import { useQueryClient } from "@tanstack/react-query";
import { useMatchStore } from "@/hooks/useMatchStore";
import UpdateMatchDialog from "@/sections/Matches/Update/dialog";
import AddShiftDialog from "@/sections/Auth/Profile/Matches/NewShift/new-shift";
import RoundOf16Card from "./RoundOf16/card";
import QuarterFinalsCard from "./Quarters/card";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import SemiFinalCard from "./SemiFinal/card";
import FinalCard from "./Final/card";
function PlayOffCards({
  idTournament,
  idCategory,
}: {
  idTournament: number;
  idCategory: number;
}) {
  // Obtener estado del playoff para saber la ronda inicial
  const { data: playoffStatus } = usePlayoffStageStatus(
    idTournament,
    idCategory,
    !!idTournament && !!idCategory
  );

  // Usar React Query hooks con condiciones basadas en la ronda inicial
  const { data: roundOf16 = [], isLoading: roundOf16Loading } = useRoundOf16(
    idTournament,
    idCategory,
    playoffStatus?.startingRound === "RoundOf16"
  );
  const { data: quarterFinals = [], isLoading: quarterFinalsLoading } = useQuarterFinals(
    idTournament,
    idCategory,
    playoffStatus?.exists || false
  );
  const { data: semiFinals = [], isLoading: semiFinalsLoading } = useSemifinals(
    idTournament,
    idCategory,
    playoffStatus?.exists || false
  );
  const { data: finals = [], isLoading: finalsLoading } = useFinals(
    idTournament,
    idCategory,
    playoffStatus?.exists || false
  );

  const loading = roundOf16Loading || quarterFinalsLoading || semiFinalsLoading || finalsLoading;
  const queryClient = useQueryClient();

  // Función para refrescar todas las queries de playoffs
  const updateAllMatches = () => {
    queryClient.invalidateQueries({ queryKey: ["round-of-16", idTournament, idCategory] });
    queryClient.invalidateQueries({ queryKey: ["quarter-finals", idTournament, idCategory] });
    queryClient.invalidateQueries({ queryKey: ["semifinals", idTournament, idCategory] });
    queryClient.invalidateQueries({ queryKey: ["finals", idTournament, idCategory] });
  };
  
  const { selectMatch } = useMatchStore();
  const [isAddResultDialogOpen, setIsAddResultDialogOpen] = useState(false);
  const [isAddShiftDialogOpen, setIsAddShiftDialogOpen] = useState(false);

  const handleAddResult = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddResultDialogOpen(true);
  };

  const handleAddShift = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddShiftDialogOpen(true);
  };

  return (
    <section className="w-full md:py-16 lg:py-20">
      <div className="mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Fase Final
          </h1>
        </div>
        {playoffStatus?.startingRound === "RoundOf16" && roundOf16 && roundOf16.length > 0 && (
          <RoundOf16Card
            matches={roundOf16}
            handleAddResult={handleAddResult}
            handleAddShift={handleAddShift}
          />
        )}
        {quarterFinals && quarterFinals.length > 0 && (
          <QuarterFinalsCard
            matches={quarterFinals}
            handleAddResult={handleAddResult}
            handleAddShift={handleAddShift}
          />
        )}
        {semiFinals && semiFinals.length > 0 && (
          <SemiFinalCard
            matches={semiFinals}
            handleAddResult={handleAddResult}
            handleAddShift={handleAddShift}
          />
        )}
        {finals && finals.length > 0 && (
          <FinalCard
            matches={finals}
            handleAddResult={handleAddResult}
            handleAddShift={handleAddShift}
          />
        )}
        <UpdateMatchDialog
          isOpen={isAddResultDialogOpen}
          updateMatches={updateAllMatches}
          onClose={() => setIsAddResultDialogOpen(false)}
        />
        <AddShiftDialog
          isOpen={isAddShiftDialogOpen}
          updateMatches={updateAllMatches}
          onClose={() => setIsAddShiftDialogOpen(false)}
        />
      </div>
    </section>
  );
}

export default PlayOffCards;
