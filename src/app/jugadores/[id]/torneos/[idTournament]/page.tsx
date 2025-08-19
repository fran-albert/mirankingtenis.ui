"use client";
import React from "react";
import MatchesByTournamentPlayer from "@/sections/Tournament/ByPlayer/matches";
import ChartRankingByPlayer from "@/sections/Tournament/ByPlayer/ranking";
import StatisticsByPlayer from "@/sections/Tournament/ByPlayer/statistics";
import { useTournamentCategoriesByUser } from "@/hooks/Tournament-Category/useTournamentCategory";
import { useParams } from "next/navigation";
import { useTournamentRankingPlayerTournamentSummary } from "@/hooks/Tournament-Ranking/useTournamentRankingPlayerTournamentSummary";
import { useTournamentRankingHistory } from "@/hooks/Tournament-Ranking/useTournamentRankingHistory";
import { useTournament } from "@/hooks/Tournament/useTournament";
import { formatDate } from "@/lib/utils";
import { formatTournamentDates } from "@/common/helpers/helpers";
import Loading from "@/components/Loading/loading";
import { useMatchesByUser } from "@/hooks/Matches/useMatches";

function TournamentPlayerPage() {
  const { id, idTournament } = useParams();
  const idUser = Number(id);
  // Usar React Query hook para tournament categories
  const { categoriesForTournaments, isLoading: isLoadingTCategories } = useTournamentCategoriesByUser({ 
    idUser: idUser, 
    enabled: !!idUser 
  });
  // Obtener la categoría del torneo actual
  const matchingTournament = categoriesForTournaments?.find(
    (category) => category.tournament.id === Number(idTournament)
  );
  
  // Usar React Query hooks para tournament ranking
  const { playerMatchSummary, isLoading: isLoadingPlayerMatchSummary } = useTournamentRankingPlayerTournamentSummary({
    idPlayer: idUser,
    idTournament: Number(idTournament),
    idCategory: matchingTournament?.category.id || 0,
    enabled: !!idUser && !!idTournament && !!matchingTournament?.category.id
  });
  
  const { historyRanking = [], isLoading: isLoadingHistoryRanking } = useTournamentRankingHistory({
    idPlayer: idUser,
    idTournament: Number(idTournament),
    idCategory: matchingTournament?.category.id || 0,
    enabled: !!idUser && !!idTournament && !!matchingTournament?.category.id
  });
  
  // Usar React Query hook para obtener el torneo
  const { tournament, isLoading: isLoadingTournaments } = useTournament({ 
    idTournament: Number(idTournament), 
    enabled: !!idTournament 
  });
  
  // Usar React Query hook para obtener partidos del usuario
  const { data: matches = [], isLoading: isLoadingMatches } = useMatchesByUser(
    idUser, 
    Number(idTournament), 
    matchingTournament?.category.id || 0, 
    !!idUser && !!idTournament && !!matchingTournament?.category.id
  );

  // Obtener nombre de categoría directamente de los datos
  const categoryName = matchingTournament?.category.name || "";

  const validPositions = historyRanking.filter(
    (ranking) => ranking.position !== null
  );
  const bestPosition = Math.min(
    ...validPositions.map((ranking) => ranking.position)
  );

  if (
    isLoadingTournaments ||
    isLoadingMatches ||
    isLoadingPlayerMatchSummary ||
    isLoadingHistoryRanking ||
    isLoadingTCategories ||
    !tournament ||
    !categoriesForTournaments
  ) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className="grid gap-6 container mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{tournament?.name}</h1>
        <p className="text-muted-foreground">
          {formatTournamentDates(
            String(tournament?.startedAt),
            String(tournament?.finishedAt)
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MatchesByTournamentPlayer matches={matches} />
        <ChartRankingByPlayer historyRanking={historyRanking} />
      </div>
      <StatisticsByPlayer
        matchSummary={playerMatchSummary}
        category={categoryName}
        initialPosition={historyRanking[0]?.position || 0}
        bestPosition={bestPosition}
      />
    </div>
  );
}

export default TournamentPlayerPage;
