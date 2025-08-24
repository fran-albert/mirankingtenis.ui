"use client";
import React, { useState } from "react";
import Loading from "@/components/Loading/loading";
import { GroupStage } from "@/sections/Master/Group/group-stage";
import PlayOffCards from "@/sections/Master/PlayOffs";
import FiltersMaster from "@/sections/Master/Filters";
import { FixtureGroupStage } from "@/sections/Master/Fixture";
import { useGroupsByStage, useGroupRankings } from "@/hooks/Group/useGroup";
import { useGroupsStageByTournamentCategory } from "@/hooks/Group-Stage/useGroupStage";
import { useMatchesByGroupStage } from "@/hooks/Matches/useMatches";

function ClientMasterComponent() {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTournament, setSelectedTournament] = useState("2");

  // Hook para obtener el groupStageId
  const { groups: groupStageData, isLoading: groupStageLoading } =
    useGroupsStageByTournamentCategory(
      Number(selectedTournament),
      Number(selectedCategory)
    );

  const groupStageId = groupStageData as unknown as number;

  // Hooks para obtener grupos y rankings
  const { groups, isLoading: groupsLoading } = useGroupsByStage(
    groupStageId,
    !!groupStageId
  );

  const { rankings: groupRankings, isLoading: rankingsLoading } =
    useGroupRankings(groupStageId, !!groupStageId);

  // Hook para obtener matches por groupStage
  const { data: groupFixture = [], isLoading: matchesLoading, refetch: refetchMatches } = useMatchesByGroupStage(groupStageId, !!groupStageId);

  const updateMatches = async () => {
    await refetchMatches();
  };

  const loading =
    groupStageLoading || groupsLoading || rankingsLoading || matchesLoading;

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
          <div>
            <GroupStage groupRankings={groupRankings} />
            <FixtureGroupStage
              groupFixture={groupFixture}
              updateMatches={updateMatches}
            />
          </div>
          <div>
            <PlayOffCards
              idTournament={2}
              idCategory={Number(selectedCategory)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientMasterComponent;
