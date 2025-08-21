import React, { useEffect, useState } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import CreateFixtureForGroup from "./dialog";
import { useHasGroupsForCategory } from "@/hooks/Group/useGroup";
import { useHasPlayersForCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import Loading from "@/components/Loading/loading";

function MasterCategoriesCard({
  category,
  onFixtureCreated,
  idTournament,
}: {
  category: TournamentCategory;
  idTournament: number;
  onFixtureCreated: (idCategory: number) => void;
}) {
  // Usar React Query hooks
  const { hasGroups } = useHasGroupsForCategory(idTournament, category.id);
  const { data: hasParticipants = false } = useHasPlayersForCategory(idTournament, category.id, !!idTournament && !!category.id);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Categoría {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasGroups && hasParticipants ? (
            <CreateFixtureForGroup
              idTournament={idTournament}
              onFixtureCreated={onFixtureCreated}
              idCategory={category.id}
            />
          ) : (
            <p className="text-gray-500 ">
              Para generar un fixture, primero debes crear grupos y/o agregar
              jugadores a la categoría.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MasterCategoriesCard;
