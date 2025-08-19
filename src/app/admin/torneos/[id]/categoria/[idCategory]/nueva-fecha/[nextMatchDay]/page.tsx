"use client";
import { StepsControllerV2 } from "@/sections/Fixture/stepControllerV2";
import React from "react";
import { useParams } from "next/navigation";
import { useTournament } from "@/hooks/Tournament/useTournament";
import { useTournamentCategoryId } from "@/hooks/Tournament-Category/useTournamentCategory";
import { StepsControllerGroup } from "@/sections/Fixture/Group";
import { useGroupsStageByTournamentCategory } from "@/hooks/Group-Stage/useGroupStage";
import { useGroupRankings } from "@/hooks/Group/useGroup";
function NewMatchDay() {
  const params = useParams<{
    id: string;
    idCategory: string;
    nextMatchDay: string;
  }>();
  const idTournament = Number(params.id);
  const idCategory = Number(params.idCategory);
  const nextMatchDay = Number(params.nextMatchDay);
  
  // Usar React Query hooks
  const { tournament, isLoading: isTournamentLoading } = useTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  
  const { tournamentCategoryId, isLoading: isTournamentCategoryLoading } = useTournamentCategoryId({
    idTournament,
    idCategory,
    enabled: !!idTournament && !!idCategory
  });
  
  // Usar React Query hooks para Group Stage
  const { groups: groupStageId, isLoading: isGroupStagesLoading } = useGroupsStageByTournamentCategory(
    idTournament, 
    idCategory, 
    !!idTournament && !!idCategory && tournament?.type === "master"
  );
  
  // Usar React Query hook para Group Rankings
  const { rankings: groupRankings, isLoading: isGroupRankingsLoading } = useGroupRankings(
    groupStageId || 0,
    !!groupStageId && tournament?.type === "master"
  );

  // Ya no necesitamos useEffect - React Query maneja toda la carga de datos automáticamente

  const isLoading = isTournamentLoading || isTournamentCategoryLoading || 
    (tournament?.type === "master" && (isGroupStagesLoading || isGroupRankingsLoading));

  if (isLoading || !tournament || !tournamentCategoryId) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {tournament.type === "master" && (
        <StepsControllerGroup
          idTournament={idTournament}
          idCategory={idCategory}
          nextMatchDay={nextMatchDay}
          tournamentCategoryId={tournamentCategoryId}
          groupRankings={groupRankings}
        />
      )}
      {tournament.type === "league" && (
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
