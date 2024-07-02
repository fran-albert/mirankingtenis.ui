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
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
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
  const { hasPlayersForCategory } = useTournamentParticipantStore();

  const [hasParticipants, setHasParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchGroupAndPlayersStatus = async () => {
      setIsLoading(true);

      const playersStatus = await hasPlayersForCategory(
        idTournament,
        category.id
      );
      setHasParticipants(playersStatus);
      setIsLoading(false);
    };
    fetchGroupAndPlayersStatus();
  }, [category.id, hasPlayersForCategory, idTournament]);

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
