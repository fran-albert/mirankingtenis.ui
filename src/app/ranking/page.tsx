"use client";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import FiltersRanking from "@/sections/Ranking/Filters";
import { RankingTable } from "@/sections/Ranking/Table/table";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import TournamentTabs from "@/sections/Tournament/Tabs/tabs";
import React, { useEffect, useState } from "react";

function RankingPage() {
  // const [selectedTournament, setSelectedTournament] = useState(1);
  // const [selectedCategory, setSelectedCategory] = useState(1);
  // const { getTournamentCategoryId, tournamentCategoryId } =
  //   useTournamentCategoryStore();
  // useEffect(() => {
  //   if (selectedCategory && selectedTournament) {
  //     getTournamentCategoryId(selectedTournament, selectedCategory);
  //   }
  // }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [jornadas, setJornadas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getTournamentCategoryId, tournamentCategoryId } =
    useTournamentCategoryStore();

  useEffect(() => {
    if (selectedCategory && selectedTournament) {
      getTournamentCategoryId(
        Number(selectedTournament),
        Number(selectedCategory)
      );
    }
  }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  const isSelectionComplete = selectedCategory && selectedTournament;

  return (
    <>
      <FiltersRanking
        onSelectTournament={(value) => setSelectedTournament(value)}
        onSelectCategory={(value) => setSelectedCategory(value)}
        selectedTournament={selectedTournament}
        selectedCategory={selectedCategory}
      />
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl text-center font-medium">Ranking</h1>
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : isSelectionComplete ? (
            <div className="lg:px-0 m-2">
              <div className="mt-4">
                <RankingTable
                  tournamentCategoryId={tournamentCategoryId}
                  idCategory={Number(selectedCategory)}
                  idTournament={Number(selectedTournament)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Por favor, seleccione un torneo y una categoría para
              ver el ranking.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RankingPage;
