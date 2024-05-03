"use client";
import Loading from "@/components/Loading/loading";
import { getRankingByCategory } from "@/modules/ranking/application/get-by-category/getRankingByCategory";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { MasterCard } from "@/sections/Master/Cards/card";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import React, { useEffect, useMemo, useState } from "react";

function MasterPage() {
  const [selectedCategory, setSelectedCategory] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const rankingRepository = useMemo(() => createApiRankingRepositroy(), []);
  const loadRanking = useMemo(
    () => getRankingByCategory(rankingRepository),
    [rankingRepository]
  );

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true);
        const rankingData = await loadRanking(selectedCategory);
        setRanking(rankingData.slice(0, 8));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [selectedCategory, loadRanking]);

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl text-center font-medium">Torneo de Master</h1>
          <RankingTabs
            onSelectCategory={(idCategory: number) =>
              setSelectedCategory(idCategory)
            }
          />
          <div className="mt-4">
            <MasterCard players={ranking} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterPage;
