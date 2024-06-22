import React, { useEffect, useState } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import CreateFixtureForGroup from "./dialog";
import { useGroupStore } from "@/hooks/useGroup";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import Loading from "@/components/Loading/loading";

function MasterCategoriesCard({
  category,
  nextMatchDay,
  onFixtureCreated,
  idTournament,
}: {
  category: TournamentCategory;
  idTournament: number;
  onFixtureCreated: (idCategory: number) => void;
  nextMatchDay: any;
}) {
  const { hasGroupsForCategory } = useGroupStore();
  const { hasPlayersForCategory } = useTournamentParticipantStore();

  const [hasGroups, setHasGroups] = useState(false);
  const [hasParticipants, setHasParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchGroupAndPlayersStatus = async () => {
      setIsLoading(true);
      const groupStatus = await hasGroupsForCategory(idTournament, category.id);
      const playersStatus = await hasPlayersForCategory(
        idTournament,
        category.id
      );
      setHasGroups(groupStatus);
      setHasParticipants(playersStatus);
      setIsLoading(false);
    };
    fetchGroupAndPlayersStatus();
  }, [category.id, hasGroupsForCategory, hasPlayersForCategory, idTournament]);

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
            <CreateFixtureForGroup
              idTournament={idTournament}
              onFixtureCreated={onFixtureCreated}
              idCategory={category.id}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
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
