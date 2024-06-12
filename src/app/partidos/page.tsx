"use client";
import React, { useEffect, useState } from "react";
import { TennisScoreboard } from "../../sections/Matches/TennisScoreBoard/tennisScoreBoard";
import FixtureTabs from "@/sections/Matches/FixtureTabs/tabs";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import TournamentTabs from "@/sections/Tournament/Tabs/tabs";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import { useFixtureStore } from "@/hooks/useFixture";

function MatchesPage() {
  const [selectedJornada, setSelectedJornada] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedTournament, setSelectedTournament] = useState(1);
  const [jornadas, setJornadas] = useState<number[]>([]);
  const fixtureRepository = createApiFixtureRepository();
  const { getTournamentCategoryId, tournamentCategoryId } =
    useTournamentCategoryStore();

  const {
    createFixture,
    error,
    fixture,
    getFixtureByCategory,
    getFixtureByCategoryAndTournament,
    loading,
  } = useFixtureStore();

  useEffect(() => {
    const fetchJornadas = async () => {
      try {
        const numeroDeJornadas =
          await fixtureRepository.getFixtureByCategoryAndTournament(
            selectedCategory,
            selectedTournament
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

  useEffect(() => {
    if (selectedCategory && selectedTournament) {
      getTournamentCategoryId(selectedTournament, selectedCategory);
    }
  }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  console.log(tournamentCategoryId, "tournamentCategoryId")

  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-4">
          <h1 className="text-2xl text-center font-medium">Partidos</h1>
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
          <FixtureTabs
            onSelectJornada={(jornada) => setSelectedJornada(jornada)}
            selectedJornada={selectedJornada}
            jornadas={jornadas}
          />
          <div className="flex justify-center w-full lg:px-0 m-2">
            <div className="w-full">
              <TennisScoreboard
                jornada={selectedJornada}
                tournamentCategoryId={tournamentCategoryId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchesPage;
