import React, { useCallback, useEffect, useState } from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { toast } from "sonner";
import { useMatchStore } from "@/hooks/useMatch";

const matchRepository = createApiMatchRepository();

export const TennisScoreboard = ({
  jornada,
  tournamentCategoryId,
}: {
  jornada: number;
  tournamentCategoryId: number;
}) => {
  const { getMatchesByTournamentCategoryAndMatchday, matches } =
    useMatchStore();

  const fetchMatches = useCallback(async () => {
    await getMatchesByTournamentCategoryAndMatchday(
      tournamentCategoryId,
      jornada
    );
  }, [
    getMatchesByTournamentCategoryAndMatchday,
    tournamentCategoryId,
    jornada,
  ]);

  const handleDeleteMatch = async (id: number) => {
    await matchRepository.deleteMatch(id);
    toast.success("Partido eliminado correctamente");
    fetchMatches();
  };

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {matches.map((match) => (
          <ScoreMatchCard
            key={match.id}
            tournamentCategoryId={tournamentCategoryId}
            idUser1={match.idUser1}
            idUser2={match.idUser2}
            match={match}
            onMatchDecided={fetchMatches}
            onDeleteMatch={() => handleDeleteMatch(match.id)}
          />
        ))}
      </div>
    </div>
  );
};
