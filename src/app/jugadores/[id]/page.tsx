"use client";
import { useParams } from "next/navigation";
import React from "react";
import Loading from "@/components/Loading/loading";
import { 
  useCurrentTournamentByPlayer, 
  useAllTournamentsByPlayer, 
  useCompletedTournamentsByPlayer,
  usePlayerInfo
} from "@/hooks/Tournament/useTournament";
import { useMatchStore } from "@/hooks/useMatch";
import { usePlayerSetSummary } from "@/hooks/Sets/useSet";
import { useUserStore } from "@/hooks/useUser";
import { PlayerComponent } from "@/sections/Players/Component/player-component";
import { useUser } from "@/hooks/Users/useUser";
import { useTournamentRankingPlayerSummary } from "@/hooks/Tournament-Ranking/useTournamentRankingPlayerSummary";

function PlayerDetailsPage() {
  const params = useParams();
  const idParam = params.id;
  const idUser = Number(idParam);
  // Usar los nuevos hooks de React Query
  const { tournament: currentTournaments, isLoading: isCurrentTournamentLoading } = useCurrentTournamentByPlayer({ 
    idPlayer: idUser, 
    enabled: !!idUser 
  });
  
  const { tournaments: allTournaments, isLoading: isAllTournamentsLoading } = useAllTournamentsByPlayer({ 
    idPlayer: idUser, 
    enabled: !!idUser 
  });
  
  const { tournaments: completedTournaments, isLoading: isCompletedTournamentsLoading } = useCompletedTournamentsByPlayer({ 
    idPlayer: idUser, 
    enabled: false // Temporalmente deshabilitado porque el endpoint devuelve 404
  });
  
  const { playerInfo, isLoading: isPlayerInfoLoading } = usePlayerInfo({ 
    idTournament: currentTournaments?.id || 0, 
    idPlayer: idUser,
    enabled: !!idUser && !!currentTournaments?.id
  });

  const isTournamentLoading = isCurrentTournamentLoading || isAllTournamentsLoading || isCompletedTournamentsLoading || isPlayerInfoLoading;

  const { playerMatchSummary } = useTournamentRankingPlayerSummary({
    idPlayer: idUser,
    enabled: !!!idUser,
  });
  const {
    getAllMatchesByUser,
    matches,
    nextMatch,
    getNextMatch,
    loading: isMatchLoading,
  } = useMatchStore();
  // Usar React Query hook para el resumen de sets del jugador
  const { data: setSummary, isLoading: isLoadingSets } = usePlayerSetSummary(idUser, !!idUser);
  // const { loading: isLoadingUser, getUser, user } = useUserStore();
  const { user, isLoading, error } = useUser({
    auth: true,
    id: idUser,
  });
  const currentUser = user?.name + " " + user?.lastname;

  if (isTournamentLoading || isLoading || isLoadingSets) {
    return <Loading isLoading />;
  }

  return (
    <div className="flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
      {user && (
        <PlayerComponent
          player={user}
          setSummary={setSummary}
          currentUser={currentUser}
          matchSummary={playerMatchSummary}
          nextMatch={nextMatch}
          matches={matches}
          currentTournaments={currentTournaments}
          allTournaments={allTournaments}
          completedTournaments={completedTournaments}
          playerInfo={playerInfo!}
        />
      )}
    </div>
  );
}

export default PlayerDetailsPage;
