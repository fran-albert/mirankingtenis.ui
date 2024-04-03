"use client";
import React, { useEffect, useState } from "react";
import { TennisScoreboard } from "../../sections/Matches/TennisScoreBoard/tennisScoreBoard";
import FixtureTabs from "@/sections/Matches/FixtureTabs/tabs";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";

function MatchesPage() {
  const [selectedJornada, setSelectedJornada] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [jornadas, setJornadas] = useState<number[]>([]);
  const fixtureRepository = createApiFixtureRepository();

  useEffect(() => {
    const fetchJornadas = async () => {
      try {
        const numeroDeJornadas = await fixtureRepository.countByCategory(
          selectedCategory
        );
        const jornadasArray = Array.from(
          { length: numeroDeJornadas },
          (_, i) => i + 1
        );
        setJornadas(jornadasArray);
        setSelectedJornada(jornadasArray[jornadasArray.length - 1]);
      } catch (error) {
        console.error("Error fetching número de jornadas", error);
      }
    };

    if (selectedCategory) {
      fetchJornadas();
    }
  }, [selectedCategory]);
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
            selectedJornada={selectedJornada}
            jornadas={jornadas}
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
