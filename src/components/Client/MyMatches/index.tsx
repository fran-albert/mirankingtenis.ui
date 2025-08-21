"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import {
  useAllTournamentsByPlayer,
  useCurrentTournamentByPlayer,
  useLastTournamentByPlayer,
} from "@/hooks/Tournament/useTournament";
import { useTournamentRankingHistory } from "@/hooks/Tournament-Ranking/useTournamentRankingHistory";
import { useMatchesByUser } from "@/hooks/Matches/useMatches";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import React, { useState } from "react";
import { TournamentSelect } from "@/components/Select/Tournament/allTournament.select";
import {
  useTournamentCategoriesByUser,
  useTournamentCategoryId,
} from "@/hooks/Tournament-Category/useTournamentCategory";
import { Tournament } from "@/types/Tournament/Tournament";
import { MatchByUserResponseDto, MatchByUserWithRival } from "@/types/Match/MatchByUser.dto";

function ClientMyMatchesComponent() {
  const { session } = useCustomSession();
  const idUser = Number(session?.user?.id);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
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

  // Hook para obtener los partidos del usuario en el torneo y categoría seleccionados
  const { 
    data: rawMatches = [], 
    isLoading: isLoadingMatches,
    error: matchesError,
    refetch: refetchMatches
  } = useMatchesByUser(
    idUser,
    activeTournament?.id || 0,
    firstCategory?.category.id || 0,
    isValidIdUser && !!activeTournament && !!firstCategory?.category.id
  );

  // Procesar matches para agregar rivalName calculado
  const matches: MatchByUserWithRival[] = React.useMemo(() => {
    return rawMatches.map((match: MatchByUserResponseDto): MatchByUserWithRival => {
      if (match.isBye) {
        return { ...match, rivalName: "Fecha Libre" };
      }

      // Determinar quién es el rival basándose en user1 y user2
      let rivalName = "";
      if (match.user1 && match.user1.id !== idUser) {
        rivalName = `${match.user1.lastname}, ${match.user1.name}`;
      } else if (match.user2 && match.user2.id !== idUser) {
        rivalName = `${match.user2.lastname}, ${match.user2.name}`;
      } else {
        rivalName = "Rival desconocido";
      }

      return { 
        ...match, 
        rivalName,
        tournamentCategoryId: firstCategory?.category.id || 0
      };
    });
  }, [rawMatches, idUser, firstCategory?.category.id]);

  const handleTournamentChange = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    // React Query hooks se actualizarán automáticamente cuando cambie el torneo
    // Los partidos se recargarán automáticamente con el nuevo torneo y categoría
  };

  const handleUpdateMatches = () => {
    // Refrescar los partidos cuando se actualice algo
    refetchMatches();
  };

  if (isLoadingMatches) {
    return <Loading isLoading />;
  }

  // Mostrar error si hay problemas cargando los partidos
  if (matchesError) {
    console.error("Error cargando partidos:", matchesError);
  }

  return (
    <div className="container mt-4">
      <div className="container space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis Partidos</h2>
          <p className="text-muted-foreground">
            Aquí puedes ver el historial de ranking y tus próximos partidos.
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
            {matches.length > 0 ? (
              <MatchesIndex
                match={matches}
                onUpdateMatches={handleUpdateMatches}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg">No tienes partidos en este torneo y categoría.</p>
                <p className="text-sm mt-2">
                  {firstCategory ? 
                    `Categoría: ${firstCategory.category.name}` : 
                    "Selecciona un torneo para ver tus partidos"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientMyMatchesComponent;
