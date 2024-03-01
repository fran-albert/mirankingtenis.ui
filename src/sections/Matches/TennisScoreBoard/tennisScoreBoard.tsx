import React, { useEffect, useState } from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";
import { Match } from "@/modules/match/domain/Match";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";

export const TennisScoreboard = ({
  jornada,
  idCategory,
}: {
  jornada: number;
  idCategory: number;
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = createApiMatchRepository();
  const deleteMatch = matchRepository.deleteMatch;

  const handleDeleteMatch = async (id: number) => {
    await deleteMatch(id);
    // Actualizar la lista de partidos tras borrar uno.
    const updatedMatches = await matchRepository.getByCategoryAndMatchday(idCategory, jornada);
    setMatches(updatedMatches);
  };


  useEffect(() => {
    const fetchMatches = async () => {
      const matches = await matchRepository.getByCategoryAndMatchday(
        idCategory,
        jornada
      );
      setMatches(matches);
    };

    fetchMatches();
  }, [jornada, idCategory]);

  console.log(matches.map((match) => match.id));

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <ScoreMatchCard
            key={index}
            player1={match.user1}
            player2={match.user2}
            match={match.id}
            onDeleteMatch={() => handleDeleteMatch(match.id)} 
          />
        ))}
      </div>
    </div>
  );
};
