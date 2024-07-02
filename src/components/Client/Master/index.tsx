"use client";
import Loading from "@/components/Loading/loading";
import { GroupStage } from "@/sections/Master/Group/group-stage";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { MasterCard } from "@/sections/Master/Cards/card";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import React, { useEffect, useState } from "react";
import { useGroupStore } from "@/hooks/useGroup";
import { Separator } from "@/components/ui/separator";
import { FixtureGroupStage } from "@/sections/Master/Fixture";
import { useMatchStore } from "@/hooks/useMatch";
import { AxiosError } from "axios";
import PlayOffCards from "@/sections/Master/PlayOffs";
import { CategoryMatchesSelect } from "@/components/Select/Category/selectMatches";
import FiltersRanking from "@/sections/Ranking/Filters";
import FiltersMaster from "@/sections/Master/Filters";

function ClientMasterComponent() {
  const [selectedCategory, setSelectedCategory] = useState("1");
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
          2,
          Number(selectedCategory)
        );
        setGroupStageId(groupStageId);
        await updateMatches(groupStageId);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(axiosError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupStageId();
  }, [selectedCategory]);

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
        onSelectCategory={(value) => setSelectedCategory(value)}
        selectedTournament={"2"}
        selectedCategory={selectedCategory}
      />
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <div className="mt-4">
            <GroupStage groupRankings={groupRankings} />
            <FixtureGroupStage
              groupFixture={groupFixture}
              updateMatches={() => updateMatches(groupStageId!)}
            />
          </div>
        </div>
      </div>
      {/* <PlayOffCards /> */}
    </div>
  );
}

export default ClientMasterComponent;
