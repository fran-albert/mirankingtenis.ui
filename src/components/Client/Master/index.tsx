"use client";
import Loading from "@/components/Loading/loading";
import { GroupStage } from "@/sections/Master/Group/group-stage";
import { getRankingByCategory } from "@/modules/ranking/application/get-by-category/getRankingByCategory";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { MasterCard } from "@/sections/Master/Cards/card";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import React, { useEffect, useMemo, useState } from "react";
import { useGroupStore } from "@/hooks/useGroup";
import { Separator } from "@/components/ui/separator";
import { FixtureGroupStage } from "@/sections/Master/Fixture";
import { useMatchStore } from "@/hooks/useMatch";
import { AxiosError } from "axios";
import Image from "next/image";
import PlayOffCards from "@/sections/Master/PlayOffs";
import { CategorySelect } from "@/components/Select/Category/select";

function ClientMasterComponent() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const { groupFixture, findMatchesByGroupStage } = useMatchStore();
  const {
    findAllByGroupStage,
    getGroupRankings,
    getGroupStagesByTournamentCategory,
    groupRankings,
    loading: isLoadinGroup,
  } = useGroupStore();

  const [groupStageId, setGroupStageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    const fetchGroupStageId = async () => {
      try {
        setIsLoading(true);
        const groupStageId = await getGroupStagesByTournamentCategory(
          2,
          selectedCategory
        );
        setGroupStageId(groupStageId);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          setHasError(true);
        }
        console.error(axiosError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupStageId();
  }, [getGroupStagesByTournamentCategory, selectedCategory]);

  useEffect(() => {
    const fetchGroupsAndRankings = async () => {
      if (groupStageId !== null) {
        try {
          setIsLoading(true);
          await findAllByGroupStage(groupStageId);
          await getGroupRankings(groupStageId);
          await findMatchesByGroupStage(groupStageId);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    };

    fetchGroupsAndRankings();
  }, [
    groupStageId,
    findAllByGroupStage,
    getGroupRankings,
    findMatchesByGroupStage,
  ]);

  useEffect(() => {
    if (!isLoadinGroup && !isLoading) {
      setIsLoading(false);
    }
  }, [isLoadinGroup, isLoading]);

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      {hasError ? (
        <main className="flex-1 container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Torneo Master
              </h1>
              <div className="bg-primary rounded-lg px-3 py-1 inline-block text-white text-sm font-medium">
                Próximamente
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Prepárate para un emocionante Torneo Master lleno de acción,
                estrategia y premios increíbles.
              </p>
            </div>
            <div>
              <Image
                src="https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/images/Master-2024-portada.png"
                alt="Torneo Master"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </main>
      ) : (
        <>
          <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
            <div className="w-full max-w-7xl space-y-6">
              <h1 className="text-2xl text-center font-medium">
                Torneo de Master
              </h1>
              <RankingTabs
                onSelectCategory={(idCategory: number) =>
                  setSelectedCategory(idCategory)
                }
              />
              <div className="mt-4">
                <>
                  <GroupStage groupRankings={groupRankings} />
                  <Separator className="mt-4 mb-4" />
                  <FixtureGroupStage groupFixture={groupFixture} />
                </>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  <PlayOffCards />;
}

export default ClientMasterComponent;
