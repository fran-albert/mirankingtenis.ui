"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import {
  useAllTournamentsByPlayer,
  useCurrentTournamentByPlayer,
  useLastTournamentByPlayer,
} from "@/hooks/Tournament/useTournament";
import { useTournamentRankingHistory } from "@/hooks/Tournament-Ranking/useTournamentRankingHistory";
import { useUserStore } from "@/hooks/useUser";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import React, { useState } from "react";
import { TournamentSelect } from "@/components/Select/Tournament/allTournament.select";
import {
  useTournamentCategoriesByUser,
  useTournamentCategoryId,
} from "@/hooks/Tournament-Category/useTournamentCategory";
import { Tournament } from "@/types/Tournament/Tournament";

function ClientMyMatchesComponent() {
  const { session } = useCustomSession();
  const idUser = Number(session?.user?.id);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
  const { getUser, user } = useUserStore();

  // Usar React Query hooks para torneos
  const { tournaments: allTournamentsByPlayer } = useAllTournamentsByPlayer({
    idPlayer: idUser,
    enabled: isValidIdUser,
  });

  const { tournament: currentTournamentByPlayer } =
    useCurrentTournamentByPlayer({
      idPlayer: idUser,
      enabled: isValidIdUser,
    });

  const { tournament: lastTournamentByPlayer } = useLastTournamentByPlayer({
    idPlayer: idUser,
    enabled: isValidIdUser,
  });

  // Usar React Query hooks para tournament categories
  const { categoriesForTournaments } = useTournamentCategoriesByUser({
    idUser: idUser,
    enabled: isValidIdUser,
  });
  // Estado local para matches (se actualizará con diferentes parámetros)
  const [matches, setMatches] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // React Query hooks manejan automáticamente la carga de datos

  const [selectedTournament, setSelectedTournament] = useState<
    Tournament | undefined
  >(undefined);

  // Usar torneo seleccionado o último torneo como fallback
  const activeTournament = selectedTournament || lastTournamentByPlayer;
  
  // Obtener la categoría del torneo activo
  const selectedCategories = activeTournament
    ? categoriesForTournaments.filter(
        (tc) => tc.tournament.id === activeTournament.id
      )
    : [];

  // Usar React Query hook para history ranking (solo para la primera categoría por simplicidad)
  const firstCategory = selectedCategories[0];

  // Usar React Query hook para tournament category ID
  const { tournamentCategoryId } = useTournamentCategoryId({
    idTournament: activeTournament?.id || 0,
    idCategory: firstCategory?.category.id || 0,
    enabled: !!activeTournament && !!firstCategory?.category.id,
  });
  const { historyRanking = [] } = useTournamentRankingHistory({
    idPlayer: idUser,
    idTournament: activeTournament?.id || 0,
    idCategory: firstCategory?.category.id || 0,
    enabled:
      isValidIdUser && !!activeTournament && !!firstCategory?.category.id,
  });

  // React Query maneja automáticamente la configuración inicial

  // React Query hooks manejan automáticamente la carga de partidos

  const handleTournamentChange = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    // React Query hooks se actualizarán automáticamente cuando cambie el torneo
  };

  const handleUpdateMatches = () => {
    // React Query maneja automáticamente las actualizaciones
    // Esta función puede ser simplificada o eliminada en el futuro
  };

  if (isLoadingMatches) {
    return <Loading isLoading />;
  }

  return (
    <div className="container mt-4">
      <div className="container space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis Partidos</h2>
          <p className="text-muted-foreground">
            Aquí puedes ver el historial de ranking y los próximos partidos de
            tu equipo favorito.
          </p>
        </div>
        <div className="w-full relative">
          <TournamentSelect
            selected={activeTournament}
            onTournament={handleTournamentChange}
            userId={isValidIdUser ? idUser : undefined}
            currentTournamentByPlayer={currentTournamentByPlayer}
            lastTournament={lastTournamentByPlayer}
          />
        </div>
      </div>
      {!activeTournament ? (
        <div className="mt-10 text-center text-lg font-semibold text-muted-foreground">
          Por favor selecciona un torneo para ver los partidos.
        </div>
      ) : (
        <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
          <div className="w-full max-w-7xl space-y-6">
            {activeTournament.type === "league" && (
              <PlayerChart
                player={historyRanking}
                tournamentCategoryId={tournamentCategoryId!}
              />
            )}
            <MatchesIndex
              match={matches}
              onUpdateMatches={handleUpdateMatches}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientMyMatchesComponent;
