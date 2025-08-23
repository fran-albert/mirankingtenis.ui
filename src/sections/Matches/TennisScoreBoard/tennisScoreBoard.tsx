import React from "react";
import { ScoreMatchCard } from "@/sections/Matches/ScoreMatchCard/card";
import { toast } from "sonner";
import { useMatchesByTournamentCategoryAndMatchday, useDeleteMatch } from "@/hooks/Matches/useMatches";

export const TennisScoreboard = ({
  jornada,
  tournamentCategoryId,
}: {
  jornada: number;
  tournamentCategoryId: number;
}) => {
  // Usar React Query hook para obtener partidos
  const { data: matches = [], isLoading, refetch } = useMatchesByTournamentCategoryAndMatchday(
    tournamentCategoryId,
    jornada,
    !!tournamentCategoryId && !!jornada
  );

  // Hook para eliminar partido
  const deleteMatchMutation = useDeleteMatch();

  const handleDeleteMatch = async (id: number) => {
    deleteMatchMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Partido eliminado correctamente");
        refetch();
      },
      onError: (error) => {
        toast.error("Error al eliminar el partido");
        console.error("Error deleting match:", error);
      }
    });
  };

  if (isLoading) {
    return <div className="container mx-auto text-center py-4">Cargando partidos...</div>;
  }

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
            onMatchDecided={() => refetch()}
            onDeleteMatch={() => handleDeleteMatch(match.id)}
          />
        ))}
      </div>
    </div>
  );
};
