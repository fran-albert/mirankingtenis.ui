"use client";
import React, { useState } from "react";
import { TennisScoreboard } from "../../sections/Matches/TennisScoreBoard/tennisScoreBoard";
import FixtureTabs from "@/sections/Matches/FixtureTabs/tabs";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";

function MatchesPage() {
  const [selectedJornada, setSelectedJornada] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-4">
          <h1 className="text-2xl text-center font-medium">Partidos</h1>
          <RankingTabs
            onSelectCategory={(idCategory: number) =>
              setSelectedCategory(idCategory)
            }
          />
          <FixtureTabs
            onSelectJornada={(jornada) => setSelectedJornada(jornada)}
          />
          <div className="flex justify-center w-full lg:px-0 m-2">
            <div className="w-full">
              <TennisScoreboard
                jornada={selectedJornada}
                idCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchesPage;
