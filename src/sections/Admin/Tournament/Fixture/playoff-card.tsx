import React, { useEffect, useState } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import CreateFixtureForGroup from "./dialog";
import { useHasGroupsForCategory } from "@/hooks/Group/useGroup";
import { useHasPlayersForCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import Loading from "@/components/Loading/loading";
import CreatePlayOffForCategory from "./playoffdialog";

function PlayOffCategoriesCard({
  category,
  onFixtureCreated,
  idTournament,
}: {
  category: TournamentCategory;
  idTournament: number;
  onFixtureCreated: (idCategory: number) => void;
}) {
  // Usar React Query hooks
  const { hasGroups, isLoading: isLoadingGroups } = useHasGroupsForCategory(idTournament, category.id);
  const { data: hasParticipants = false, isLoading: isLoadingParticipants } = useHasPlayersForCategory(idTournament, category.id, !!idTournament && !!category.id);

  const isLoading = isLoadingGroups || isLoadingParticipants;

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Categoría {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasGroups && hasParticipants ? (
            <CreatePlayOffForCategory
              idTournament={idTournament}
              onFixtureCreated={onFixtureCreated}
              idCategory={category.id}
            />
          ) : (
            <p className="text-gray-500">
              Para generar un fixture, primero debes crear grupos y/o agregar
              jugadores a la categoría.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PlayOffCategoriesCard;
