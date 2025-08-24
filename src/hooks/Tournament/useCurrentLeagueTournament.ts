"use client"

import { useMemo } from "react";
import { useAllTournaments } from "./useTournaments";
import { TournamentStatus } from "@/common/enum/tournamentStatus.enum";

/**
 * Hook para obtener el torneo actual de tipo "liga" que esté en progreso
 */
export const useCurrentLeagueTournament = () => {
  const { tournaments, isLoading, error } = useAllTournaments();

  const currentLeagueTournament = useMemo(() => {
    if (!tournaments || tournaments.length === 0) {
      return null;
    }

    // Buscar torneo de tipo "league" con estado "started" u "ongoing"
    const leagueTournament = tournaments.find(
      tournament => 
        tournament.type && 
        tournament.type.toLowerCase() === 'league' && 
        (tournament.status === TournamentStatus.started || 
         tournament.status === TournamentStatus.ongoing)
    );

    return leagueTournament || null;
  }, [tournaments]);

  return {
    currentLeagueTournament,
    isLoading,
    error,
    hasCurrentLeagueTournament: !!currentLeagueTournament
  };
};