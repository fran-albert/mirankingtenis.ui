import React, { useEffect, useState } from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";
import { Match } from "@/modules/match/domain/Match";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";

export const TennisScoreboard = ({ jornada }: { jornada: any }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  const matchRepository = createApiMatchRepository();

  useEffect(() => {
    const fetchMatches = async () => {
      const matches = await matchRepository.getAllMatches();
      const filteredMatches = matches.filter(
        (match) => match.fixture.jornada === jornada
      );
      setMatches(filteredMatches);
    };

    fetchMatches();
  }, [matchRepository, jornada]);

  console.log(matches);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <ScoreMatchCard
            key={index}
            player1={match.user1}
            player2={match.user2}
          />
        ))}
      </div>
    </div>
  );
};
