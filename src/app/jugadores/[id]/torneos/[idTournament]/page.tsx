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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/Users/useUser";

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

  // Obtener información del usuario
  const { user, isLoading: isLoadingUser } = useUser({
    auth: true,
    id: idUser,
  });
  
  // Usar React Query hook para obtener partidos del usuario
  const { data: rawMatches = [], isLoading: isLoadingMatches } = useMatchesByUser(
    idUser, 
    Number(idTournament), 
    matchingTournament?.category.id || 0, 
    !!idUser && !!idTournament && !!matchingTournament?.category.id
  );

  // Procesar matches para agregar rivalName calculado
  const matches = React.useMemo(() => {
    return rawMatches.map((match) => {
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
        tournamentCategoryId: matchingTournament?.category.id || 0
      };
    });
  }, [rawMatches, idUser, matchingTournament?.category.id]);

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
    isLoadingUser ||
    !tournament ||
    !categoriesForTournaments ||
    !user
  ) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className="grid gap-6 container mt-10">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{tournament?.name}</h1>
          <p className="text-lg text-muted-foreground mt-2">
            {user.name} {user.lastname} - {categoryName}
          </p>
        </div>
        
        <Link href={`/jugadores/${idUser}`}>
          <Button variant="outline" size="default">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al perfil
          </Button>
        </Link>
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
