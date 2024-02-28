// Importaciones de Next.js y Tailwind CSS
import React from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";

export const TennisScoreboard = ({ matches }: { matches: any }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <ScoreMatchCard
            key={index}
            player1={match.player1}
            player2={match.player2}
            round={match.round}
            court={match.court}
          />
        ))}
      </div>
    </div>
  );
};
