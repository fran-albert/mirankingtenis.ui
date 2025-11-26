"use client";
import React, { useState, useMemo, useEffect } from "react";
import Loading from "@/components/Loading/loading";
import { GroupStage } from "@/sections/Master/Group/group-stage";
import PlayOffCards from "@/sections/Master/PlayOffs";
import FiltersMaster from "@/sections/Master/Filters";
import { FixtureGroupStage } from "@/sections/Master/Fixture";
import { useGroupsByStage, useGroupRankings } from "@/hooks/Group/useGroup";
import { useGroupsStageByTournamentCategory } from "@/hooks/Group-Stage/useGroupStage";
import { useMatchesByGroupStage } from "@/hooks/Matches/useMatches";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategories";
import { useDefaultTournaments } from "@/hooks/AppConfig/useDefaultTournaments";

function ClientMasterComponent() {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTournament, setSelectedTournament] = useState("");

  // Obtener torneo por defecto desde la configuración
  const { defaults, isLoading: isLoadingDefaults } = useDefaultTournaments();

  // Setear el torneo por defecto cuando se carga la configuración
  useEffect(() => {
    if (defaults?.defaultMasterTournament && !selectedTournament) {
      setSelectedTournament(String(defaults.defaultMasterTournament));
    }
  }, [defaults, selectedTournament]);

  // Obtener categorías del torneo para verificar skipGroupStage
  const { categories = [], isLoading: categoriesLoading } = useCategoriesForTournament({
    idTournament: Number(selectedTournament),
  });

  // Verificar si la categoría seleccionada tiene skipGroupStage
  const selectedCategoryInfo = useMemo(() => {
    return categories.find(c => c.id === Number(selectedCategory));
  }, [categories, selectedCategory]);

  const isDirectPlayoff = selectedCategoryInfo?.skipGroupStage === true;

  // Hook para obtener el groupStageId (solo si no es playoff directo)
  const { groups: groupStageData, isLoading: groupStageLoading } =
    useGroupsStageByTournamentCategory(
      Number(selectedTournament),
      Number(selectedCategory)
    );

  const groupStageId = groupStageData as unknown as number;

  // Hooks para obtener grupos y rankings (solo si no es playoff directo)
  const { groups, isLoading: groupsLoading } = useGroupsByStage(
    groupStageId,
    !!groupStageId && !isDirectPlayoff
  );

  const { rankings: groupRankings, isLoading: rankingsLoading } =
    useGroupRankings(groupStageId, !!groupStageId && !isDirectPlayoff);

  // Hook para obtener matches por groupStage (solo si no es playoff directo)
  const { data: groupFixture = [], isLoading: matchesLoading, refetch: refetchMatches } = useMatchesByGroupStage(
    groupStageId,
    !!groupStageId && !isDirectPlayoff
  );

  const updateMatches = async () => {
    await refetchMatches();
  };

  const loading = isLoadingDefaults || !selectedTournament || categoriesLoading || (
    !isDirectPlayoff && (groupStageLoading || groupsLoading || rankingsLoading || matchesLoading)
  );

  if (loading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <FiltersMaster
        onSelectTournament={(value) => setSelectedTournament(value)}
        onSelectCategory={(value) => setSelectedCategory(value)}
        selectedTournament={selectedTournament}
        selectedCategory={selectedCategory}
      />
      {/* <TournamentPlayers /> */}
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          {isDirectPlayoff ? (
            // Mostrar solo bracket de playoffs para torneos directos
            <div>
              <PlayOffCards
                idTournament={Number(selectedTournament)}
                idCategory={Number(selectedCategory)}
              />
            </div>
          ) : (
            // Mostrar fase de grupos + playoffs para torneos normales
            <>
              <div>
                <GroupStage groupRankings={groupRankings} />
                <FixtureGroupStage
                  groupFixture={groupFixture}
                  updateMatches={updateMatches}
                />
              </div>
              <div>
                <PlayOffCards
                  idTournament={Number(selectedTournament)}
                  idCategory={Number(selectedCategory)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientMasterComponent;
