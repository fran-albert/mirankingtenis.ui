import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuarterFinals, useSemifinals, useFinals } from "@/hooks/PlayOff/usePlayOff";
import { useQueryClient } from "@tanstack/react-query";
import useRoles from "@/hooks/useRoles";
import { useMatchStore } from "@/hooks/useMatch";
import { Match } from "@/modules/match/domain/Match";
import UpdateMatchDialog from "@/sections/Matches/Update/dialog";
import AddShiftDialog from "@/sections/Auth/Profile/Matches/NewShift/new-shift";
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
  // Usar React Query hooks
  const { data: quarterFinals = [], isLoading: quarterFinalsLoading } = useQuarterFinals(idTournament, idCategory);
  const { data: semiFinals = [], isLoading: semiFinalsLoading } = useSemifinals(idTournament, idCategory);
  const { data: finals = [], isLoading: finalsLoading } = useFinals(idTournament, idCategory);
  
  const loading = quarterFinalsLoading || semiFinalsLoading || finalsLoading;
  const queryClient = useQueryClient();
  
  // Función para refrescar todas las queries de playoffs
  const updateAllMatches = () => {
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
