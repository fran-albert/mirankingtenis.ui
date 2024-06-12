import React, { useCallback, useEffect, useState } from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { toast } from "sonner";
import { Match } from "@/modules/match/domain/Match";

const matchRepository = createApiMatchRepository();

export const TennisScoreboard = ({
  jornada,
  tournamentCategoryId,
}: {
  jornada: number;
  tournamentCategoryId: number;
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  console.log(matches)

  const handleDeleteMatch = async (id: number) => {
    await matchRepository.deleteMatch(id);
    toast.success("Partido eliminado correctamente");
    fetchMatches();
  };

  const fetchMatches = useCallback(async () => {
    const matches =
      await matchRepository.getMatchesByTournamentCategoryAndMatchday(
        tournamentCategoryId,
        jornada
      );
    setMatches(matches);
  }, [tournamentCategoryId, jornada]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {matches.map((match) => (
          <ScoreMatchCard
            key={match.id}
            player1={match.user1}
            player2={match.user2}
            match={match}
            onMatchDecided={fetchMatches}
            onDeleteMatch={() => handleDeleteMatch(match.id)}
          />
        ))}
      </div>
    </div>
  );
};
