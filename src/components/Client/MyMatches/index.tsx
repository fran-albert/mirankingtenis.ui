"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { 
  useAllTournamentsByPlayer, 
  useCurrentTournamentByPlayer, 
  useLastTournamentByPlayer 
} from "@/hooks/Tournament/useTournament";
import { useTournamentRankingHistory } from "@/hooks/Tournament-Ranking/useTournamentRankingHistory";
import { useUserStore } from "@/hooks/useUser";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import React, { useEffect, useState } from "react";
import { TournamentSelect } from "@/components/Select/Tournament/allTournament.select";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentCategoriesByUser, useTournamentCategoryId } from "@/hooks/Tournament-Category/useTournamentCategory";
import { Tournament } from "@/types/Tournament/Tournament";

function ClientMyMatchesComponent() {
  const { session } = useCustomSession();
  const idUser = Number(session?.user?.id);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
  const { getUser, user } = useUserStore();
  
  // Usar React Query hooks para torneos
  const { tournaments: allTournamentsByPlayer } = useAllTournamentsByPlayer({ 
    idPlayer: idUser, 
    enabled: isValidIdUser 
  });
  
  const { tournament: currentTournamentByPlayer } = useCurrentTournamentByPlayer({ 
    idPlayer: idUser, 
    enabled: isValidIdUser 
  });
  
  const { tournament: lastTournamentByPlayer } = useLastTournamentByPlayer({ 
    idPlayer: idUser, 
    enabled: isValidIdUser 
  });
  
  // Usar React Query hooks para tournament categories
  const { categoriesForTournaments } = useTournamentCategoriesByUser({ 
    idUser: idUser, 
    enabled: isValidIdUser 
  });
  const {
    loading: isLoadingMatches,
    getMatchesByUser,
    matches,
  } = useMatchStore();

  useEffect(() => {
    if (isValidIdUser) {
      getUser(idUser);
      // Las categorías de torneos ahora se cargan automáticamente con React Query
    }
  }, [idUser, getUser, isValidIdUser]);

  const [selectedTournament, setSelectedTournament] = useState<
    Tournament | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Obtener la categoría del torneo seleccionado
  const selectedCategories = selectedTournament 
    ? categoriesForTournaments.filter((tc) => tc.tournament.id === selectedTournament.id)
    : [];
  
  // Usar React Query hook para history ranking (solo para la primera categoría por simplicidad)
  const firstCategory = selectedCategories[0];
  
  // Usar React Query hook para tournament category ID
  const { tournamentCategoryId } = useTournamentCategoryId({
    idTournament: selectedTournament?.id || 0,
    idCategory: firstCategory?.category.id || 0,
    enabled: !!selectedTournament && !!firstCategory?.category.id
  });
  const { historyRanking = [] } = useTournamentRankingHistory({
    idPlayer: idUser,
    idTournament: selectedTournament?.id || 0,
    idCategory: firstCategory?.category.id || 0,
    enabled: isValidIdUser && !!selectedTournament && !!firstCategory?.category.id
  });

  useEffect(() => {
    if (lastTournamentByPlayer && !selectedTournament) {
      setSelectedTournament(lastTournamentByPlayer);
      setIsLoading(false); 
    }
  }, [lastTournamentByPlayer, selectedTournament]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (isValidIdUser && selectedTournament) {
        const tournamentId = selectedTournament.id;
        const selectedCategories = categoriesForTournaments.filter(
          (tc) => tc.tournament.id === tournamentId
        );
        for (const tc of selectedCategories) {
          await getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
          // getTournamentCategoryId ya no es necesario - React Query lo maneja automáticamente
        }
      }
    };

    fetchMatches();
  }, [
    isValidIdUser,
    selectedTournament,
    categoriesForTournaments,
    getMatchesByUser,
    idUser,
  ]);

  const handleTournamentChange = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsLoading(true); 

    const fetchData = async () => {
      if (isValidIdUser && tournament) {
        const selectedCategories = categoriesForTournaments.filter(
          (tc) => tc.tournament.id === tournament.id
        );
        for (const tc of selectedCategories) {
          await getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
          // getTournamentCategoryId ya no es necesario - React Query lo maneja automáticamente
        }
      }
      setIsLoading(false); 
    };

    fetchData();
  };

  const handleUpdateMatches = () => {
    if (isValidIdUser && selectedTournament) {
      const tournamentId = selectedTournament.id;
      const selectedCategories = categoriesForTournaments.filter(
        (tc) => tc.tournament.id === tournamentId
      );
      selectedCategories.forEach((tc) => {
        getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
      });
    }
  };

  if (isLoading || isLoadingMatches) {
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
            selected={selectedTournament}
            onTournament={handleTournamentChange}
            userId={isValidIdUser ? idUser : undefined}
            currentTournamentByPlayer={currentTournamentByPlayer}
            lastTournament={lastTournamentByPlayer}
          />
        </div>
      </div>
      {!selectedTournament ? (
        <div className="mt-10 text-center text-lg font-semibold text-muted-foreground">
          Por favor selecciona un torneo para ver los partidos.
        </div>
      ) : (
        <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
          <div className="w-full max-w-7xl space-y-6">
            {selectedTournament.type === "league" && (
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
