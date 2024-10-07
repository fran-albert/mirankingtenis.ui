"use client";
import React, { useEffect, useState } from "react";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import FiltersMatches from "@/sections/Matches/Filters";
import { useTournamentStore } from "@/hooks/useTournament";
import { TennisScoreboard } from "@/sections/Matches/TennisScoreBoard/tennisScoreBoard";

function ClientMatchesComponent() {
  const [selectedJornada, setSelectedJornada] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const initialTournamentId =
    process.env.NODE_ENV === "production" ? "3" : "45";
  const [selectedTournament, setSelectedTournament] =
    useState(initialTournamentId);
  const [jornadas, setJornadas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fixtureRepository = createApiFixtureRepository();
  const { getTournamentCategoryId, tournamentCategoryId } =
    useTournamentCategoryStore();
  const { findLastFinishedLeagueTournament, tournament: lastTournament } =
    useTournamentStore();

  useEffect(() => {
    findLastFinishedLeagueTournament();
  }, [findLastFinishedLeagueTournament]);

  useEffect(() => {
    if (lastTournament && !selectedTournament) {
      setSelectedTournament(String(lastTournament.id));
    }
  }, [lastTournament, selectedTournament]);

  useEffect(() => {
    const fetchJornadas = async () => {
      if (!selectedCategory || !selectedTournament) return;
      try {
        const numeroDeJornadas =
          await fixtureRepository.getFixtureByCategoryAndTournament(
            Number(selectedCategory),
            Number(selectedTournament)
          );
  
        if (numeroDeJornadas === 0) {
          setError("Esta categoría no tiene fechas disponibles.");
          setJornadas([]);
          setSelectedJornada("");
        } else {
          const jornadasArray = Array.from(
            { length: numeroDeJornadas },
            (_, i) => i + 1
          );
          setJornadas(jornadasArray);
          // Solo selecciona la jornada 1 si no hay una jornada seleccionada previamente
          if (!selectedJornada) {
            setSelectedJornada("1");
          }
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
  }, [selectedCategory, selectedTournament, fixtureRepository, selectedJornada]);
  
  

  useEffect(() => {
    if (selectedCategory && selectedTournament) {
      getTournamentCategoryId(
        Number(selectedTournament),
        Number(selectedCategory)
      );
    }
  }, [selectedCategory, selectedTournament, getTournamentCategoryId]);

  const isSelectionComplete =
    selectedCategory && selectedTournament && selectedJornada;

  return (
    <>
      <FiltersMatches
        onSelectTournament={(value) => {
          setSelectedTournament(value);
          setSelectedCategory("");
          setSelectedJornada("");
        }}
        onSelectCategory={(value) => {
          setSelectedCategory(value);
          setSelectedJornada("");
        }}
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
              Por favor, seleccione un torneo, una categoría y una fecha para
              ver los partidos.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ClientMatchesComponent;
