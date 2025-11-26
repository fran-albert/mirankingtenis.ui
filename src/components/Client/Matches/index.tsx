"use client";
import React, { useEffect, useState } from "react";
import { useFixtureCountByTournamentCategory } from "@/hooks/Fixture/useFixtures";
import { useTournamentCategoryId } from "@/hooks/Tournament-Category/useTournamentCategory";
import FiltersMatches from "@/sections/Matches/Filters";
import { TennisScoreboard } from "@/sections/Matches/TennisScoreBoard/tennisScoreBoard";
import { useDefaultTournaments } from "@/hooks/AppConfig/useDefaultTournaments";

function ClientMatchesComponent() {
  const [selectedJornada, setSelectedJornada] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedTournament, setSelectedTournament] = useState("");

  // Obtener torneo por defecto desde la configuración
  const { defaults, isLoading: isLoadingDefaults } = useDefaultTournaments();

  // Setear el torneo por defecto cuando se carga la configuración
  useEffect(() => {
    if (defaults?.defaultLeagueTournament && !selectedTournament) {
      setSelectedTournament(String(defaults.defaultLeagueTournament));
    }
  }, [defaults, selectedTournament]);
  
  const { tournamentCategoryId } = useTournamentCategoryId({
    idTournament: Number(selectedTournament),
    idCategory: Number(selectedCategory),
    enabled: !!selectedTournament && !!selectedCategory
  });

  // Obtener el conteo de fixtures usando React Query
  const { count: numeroDeJornadas, isLoading: isLoadingFixtures, isError: isErrorFixtures } = useFixtureCountByTournamentCategory({
    idCategory: Number(selectedCategory),
    idTournament: Number(selectedTournament),
    enabled: !!selectedCategory && !!selectedTournament
  });

  // Calcular las jornadas disponibles basado en el conteo
  const jornadas = React.useMemo(() => {
    if (!numeroDeJornadas || numeroDeJornadas === 0) return [];
    return Array.from({ length: numeroDeJornadas }, (_, i) => i + 1);
  }, [numeroDeJornadas]);

  const error = React.useMemo(() => {
    if (isErrorFixtures) return "Error al obtener las jornadas.";
    if (selectedCategory && selectedTournament && numeroDeJornadas === 0) {
      return "Esta categoría no tiene fechas disponibles.";
    }
    return null;
  }, [isErrorFixtures, selectedCategory, selectedTournament, numeroDeJornadas]);

  // Reset jornada when category or tournament changes
  useEffect(() => {
    if (jornadas.length > 0 && !selectedJornada) {
      setSelectedJornada("1");
    }
    if (jornadas.length === 0 && selectedJornada) {
      setSelectedJornada("");
    }
  }, [jornadas, selectedJornada]);

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
                  tournamentCategoryId={tournamentCategoryId!}
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
