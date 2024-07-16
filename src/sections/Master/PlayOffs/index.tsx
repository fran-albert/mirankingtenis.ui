import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePlayOffStore } from "@/hooks/usePlayoff";
import { ResponsePlayOffDto } from "@/modules/playoff/domain/PlayOff";
import useRoles from "@/hooks/useRoles";
import { useMatchStore } from "@/hooks/useMatch";
import { Match } from "@/modules/match/domain/Match";
import UpdateMatchDialog from "@/sections/Matches/Update/dialog";
import AddShiftDialog from "@/sections/Auth/Profile/Matches/NewShift/new-shift";
import QuarterFinalsCard from "./Quarters/card";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
function PlayOffCards({
  idTournament,
  idCategory,
}: {
  idTournament: number;
  idCategory: number;
}) {
  const { fetchQuarterFinals, loading, quarterFinals } = usePlayOffStore();
  const { selectMatch } = useMatchStore();
  const [isAddResultDialogOpen, setIsAddResultDialogOpen] = useState(false);
  const [isAddShiftDialogOpen, setIsAddShiftDialogOpen] = useState(false);

  useEffect(() => {
    fetchQuarterFinals(idTournament, idCategory);
  }, [idTournament, idCategory]);

  const handleAddResult = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddResultDialogOpen(true);
  };

  const handleAddShift = (match: GroupFixtureDto) => {
    selectMatch(match);
    setIsAddShiftDialogOpen(true);
  };

  if (!quarterFinals || quarterFinals.length === 0) {
    return null;
  }

  return (
    <section className="w-full md:py-16 lg:py-20">
      <div className="mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Fase Final
          </h1>
        </div>
        <QuarterFinalsCard
          matches={quarterFinals}
          handleAddResult={handleAddResult}
          handleAddShift={handleAddShift}
        />
      </div>
      <UpdateMatchDialog
        isOpen={isAddResultDialogOpen}
        updateMatches={() => fetchQuarterFinals(idTournament, idCategory)}
        onClose={() => setIsAddResultDialogOpen(false)}
      />
      <AddShiftDialog
        isOpen={isAddShiftDialogOpen}
        updateMatches={() => fetchQuarterFinals(idTournament, idCategory)}
        onClose={() => setIsAddShiftDialogOpen(false)}
      />
    </section>
  );
}

export default PlayOffCards;
