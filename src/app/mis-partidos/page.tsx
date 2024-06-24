"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useTournamentStore } from "@/hooks/useTournament";
import { useUserStore } from "@/hooks/useUser";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import React, { useEffect, useState } from "react";
import { TournamentSelect } from "@/components/Select/Tournament/allTournament.select";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { useTournamentRankingStore } from "@/hooks/useTournamentRanking";

function MyMatchesPage() {
  const { session } = useCustomSession();
  const idUser = Number(session?.user?.id);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
  const { getUser, user } = useUserStore();
  const { getAllTournamentsByPlayer } = useTournamentStore();
  const {
    getTournamentCategoriesByUser,
    categoriesForTournaments,
    getTournamentCategoryId,
    tournamentCategoryId,
  } = useTournamentCategoryStore();
  const {
    loading: isLoadingMatches,
    getMatchesByUser,
    matches,
  } = useMatchStore();
  const { getHistoryRanking, historyRanking } = useTournamentRankingStore();

  useEffect(() => {
    if (isValidIdUser) {
      getUser(idUser);
      getAllTournamentsByPlayer(idUser);
      getTournamentCategoriesByUser(idUser);
    }
  }, [
    idUser,
    getUser,
    getAllTournamentsByPlayer,
    getTournamentCategoriesByUser,
    isValidIdUser,
    getMatchesByUser,
  ]);

  const [selectedTournament, setSelectedTournament] = useState<Tournament | undefined>(undefined);

  useEffect(() => {
    const fetchHistoryRanking = async () => {
      if (isValidIdUser && selectedTournament) {
        const tournamentId = selectedTournament.id;
        const selectedCategories = categoriesForTournaments.filter(tc => tc.tournament.id === tournamentId);
        for (const tc of selectedCategories) {
          await getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
          await getTournamentCategoryId(tc.tournament.id, tc.category.id);
          const tcId = tournamentCategoryId;
          await getHistoryRanking(idUser, tc.tournament.id, tc.category.id);
        }
      }
    };

    fetchHistoryRanking();
  }, [
    isValidIdUser,
    selectedTournament,
    categoriesForTournaments,
    getMatchesByUser,
    getHistoryRanking,
    getTournamentCategoryId,
    tournamentCategoryId, // Incluye tournamentCategoryId como dependencia
    idUser,
  ]);

  useEffect(() => {
    console.log("History Ranking:", historyRanking);
  }, [historyRanking]);

  const handleTournamentChange = (tournament: Tournament) => {
    setSelectedTournament(tournament);
  };

  const handleUpdateMatches = () => {
    if (isValidIdUser && selectedTournament) {
      const tournamentId = selectedTournament.id;
      const selectedCategories = categoriesForTournaments.filter(tc => tc.tournament.id === tournamentId);
      selectedCategories.forEach(tc => {
        getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
      });
    }
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
            Aquí puedes ver el historial de ranking y los próximos partidos de tu equipo favorito.
          </p>
        </div>
        <div className="w-full relative">
          <TournamentSelect
            selected={selectedTournament}
            onTournament={handleTournamentChange}
            userId={isValidIdUser ? idUser : undefined}
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
                tournamentCategoryId={tournamentCategoryId}
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

export default MyMatchesPage;
