"use client";
import React, { useEffect, useState } from "react";
import { TennisScoreboard } from "../../sections/Matches/TennisScoreBoard/tennisScoreBoard";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import FiltersMatches from "@/sections/Matches/Filters";

function MatchesPage() {
  const [selectedJornada, setSelectedJornada] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [jornadas, setJornadas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fixtureRepository = createApiFixtureRepository();
  const { getTournamentCategoryId, tournamentCategoryId } = useTournamentCategoryStore();

  useEffect(() => {
    const fetchJornadas = async () => {
      if (!selectedCategory || !selectedTournament) return;

      try {
        const numeroDeJornadas = await fixtureRepository.getFixtureByCategoryAndTournament(
          Number(selectedCategory),
          Number(selectedTournament)
        );

        if (numeroDeJornadas === 0) {
          setError("Esta categoría no tiene fechas disponibles.");
          setJornadas([]);
          setSelectedJornada("");
        } else {
          const jornadasArray = Array.from({ length: numeroDeJornadas }, (_, i) => i + 1);
          setJornadas(jornadasArray);
          setError(null); 
        }
      } catch (error) {
        console.error("Error fetching número de jornadas", error);
        setError("Error al obtener las jornadas.");
        setJornadas([]);
        setSelectedJornada("");
      }
    };

    fetchJornadas();
  }, [selectedCategory, selectedTournament, fixtureRepository]);

  useEffect(() => {
    if (selectedCategory && selectedTournament) {
      getTournamentCategoryId(Number(selectedTournament), Number(selectedCategory));
    }
  }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  const isSelectionComplete = selectedCategory && selectedTournament && selectedJornada;

  return (
    <>
      <FiltersMatches 
        onSelectTournament={(value) => setSelectedTournament(value)}
        onSelectCategory={(value) => setSelectedCategory(value)}
        onSelectJornada={(value) => setSelectedJornada(value)}
        selectedTournament={selectedTournament}
        selectedCategory={selectedCategory}
        selectedJornada={selectedJornada}
        jornadas={jornadas}
      />
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-4">
          <h1 className="text-2xl text-center font-medium">Partidos</h1>
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : isSelectionComplete ? (
            <div className="flex justify-center w-full lg:px-0 m-2">
              <div className="w-full">
                <TennisScoreboard
                  jornada={Number(selectedJornada)}
                  tournamentCategoryId={tournamentCategoryId}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Por favor, seleccione un torneo, una categoría y una fecha para ver los partidos.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MatchesPage;
