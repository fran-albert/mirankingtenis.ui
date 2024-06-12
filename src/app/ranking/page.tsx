"use client";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import { RankingTable } from "@/sections/Ranking/Table/table";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import TournamentTabs from "@/sections/Tournament/Tabs/tabs";
import React, { useEffect, useState } from "react";

function RankingPage() {
  const [selectedTournament, setSelectedTournament] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const { getTournamentCategoryId, tournamentCategoryId } =
    useTournamentCategoryStore();
  useEffect(() => {
    if (selectedCategory && selectedTournament) {
      getTournamentCategoryId(selectedTournament, selectedCategory);
    }
  }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl text-center font-medium">Ranking</h1>
          <TournamentTabs
            onSelectTournament={(idTournament: number) =>
              setSelectedTournament(idTournament)
            }
          />
          <RankingTabs
            onSelectCategory={(idCategory: number) =>
              setSelectedCategory(idCategory)
            }
          />
          <div className="mt-4">
            <RankingTable
              tournamentCategoryId={tournamentCategoryId}
              idCategory={selectedCategory}
              idTournament={selectedTournament}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default RankingPage;
