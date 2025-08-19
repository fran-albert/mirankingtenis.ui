import React, { useEffect, useState } from "react";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Create } from "@/components/Button/Create/button";
import { Category } from "@/modules/category/domain/Category";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { useHasPlayersForCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import Loading from "@/components/Loading/loading";
function CategoriesCard({
  category,
  nextMatchDay,
  idTournament,
}: {
  category: TournamentCategory;
  idTournament: number;
  nextMatchDay: any;
}) {
  // Usar React Query hook para verificar si hay jugadores para la categoría
  const { data: hasParticipants = false, isLoading } = useHasPlayersForCategory(idTournament, category.id, !!idTournament && !!category.id);

  // if (isLoading) {
  //   return <Loading isLoading />;
  // }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Categoría {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasParticipants ? (
            <Create
              idTournament={idTournament}
              path="admin/torneos/"
              category={category}
              number={nextMatchDay}
            />
          ) : (
            <p className="text-gray-500 ">
              Para generar un fixture, primero debes agregar jugadores a la
              categoría.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoriesCard;
