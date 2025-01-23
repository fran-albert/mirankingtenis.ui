"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading/loading";
import { GroupStage } from "@/sections/Master/Group/group-stage";
import { useGroupStore } from "@/hooks/useGroup";
import { useMatchStore } from "@/hooks/useMatch";
import { AxiosError } from "axios";
import PlayOffCards from "@/sections/Master/PlayOffs";
import FiltersMaster from "@/sections/Master/Filters";
import { FixtureGroupStage } from "@/sections/Master/Fixture";

function ClientMasterComponent() {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTournament, setSelectedTournament] = useState("2");
  const { groupFixture, findMatchesByGroupStage, clearMatches } =
    useMatchStore();
  const {
    findAllByGroupStage,
    getGroupRankings,
    getGroupStagesByTournamentCategory,
    groupRankings,
    clearRankings,
    loading: groupLoading,
  } = useGroupStore();

  const [groupStageId, setGroupStageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateMatches = async (groupStageId: number) => {
    try {
      setIsLoading(true);
      await Promise.all([
        findAllByGroupStage(groupStageId),
        getGroupRankings(groupStageId),
        findMatchesByGroupStage(groupStageId),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGroupStageId = async () => {
      try {
        setIsLoading(true);
        const groupStageId = await getGroupStagesByTournamentCategory(
          Number(selectedTournament),
          Number(selectedCategory)
        );
        setGroupStageId(groupStageId);
        await updateMatches(groupStageId);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupStageId();
  }, [selectedCategory, selectedTournament]);

  useEffect(() => {
    if (groupStageId !== null) {
      clearMatches();
      clearRankings();
      updateMatches(groupStageId);
    }
  }, [groupStageId]);

  if (isLoading || groupLoading) {
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

      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <div>
            <GroupStage groupRankings={groupRankings} />
            <FixtureGroupStage
              groupFixture={groupFixture}
              updateMatches={() => updateMatches(groupStageId!)}
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
