"use client";
import { StepsControllerV2 } from "@/sections/Fixture/stepControllerV2";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTournamentStore } from "@/hooks/useTournament";
import { StepsControllerGroup } from "@/sections/Fixture/Group";
import { useGroupStore } from "@/hooks/useGroup";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
function NewMatchDay() {
  const params = useParams<{
    id: string;
    idCategory: string;
    nextMatchDay: string;
  }>();
  const idTournament = Number(params.id);
  const idCategory = Number(params.idCategory);
  const nextMatchDay = Number(params.nextMatchDay);
  const { getTournament, tournament } = useTournamentStore();
  const {
    getGroupRankings,
    groupRankings,
    getGroupStagesByTournamentCategory,
    groupStageId,
  } = useGroupStore();
  const { getTournamentCategoryId, tournamentCategoryId } =
    useTournamentCategoryStore();

  useEffect(() => {
    getTournament(idTournament);
    getTournamentCategoryId(idTournament, idCategory);

    if (tournament?.type === "master") {
      getGroupStagesByTournamentCategory(idTournament, idCategory);
      getGroupRankings(Number(groupStageId));
    }
  }, [
    idTournament,
    idCategory,
    groupStageId,
    tournament?.type,
    getTournament,
    getTournamentCategoryId,
    getGroupStagesByTournamentCategory,
    getGroupRankings,
  ]);

  return (
    <div>
      {tournament?.type === "master" && (
        <StepsControllerGroup
          idTournament={idTournament}
          idCategory={idCategory}
          nextMatchDay={nextMatchDay}
          tournamentCategoryId={tournamentCategoryId}
          groupRankings={groupRankings}
        />
      )}
      {tournament?.type === "league" && (
        <StepsControllerV2
          idTournament={idTournament}
          tournamentCategoryId={tournamentCategoryId}
          idCategory={idCategory}
          nextMatchDay={nextMatchDay}
        />
      )}
    </div>
  );
}

export default NewMatchDay;
