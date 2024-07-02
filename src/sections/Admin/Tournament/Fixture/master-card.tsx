import React, { useEffect, useState } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import CreateFixtureForGroup from "./dialog";
import { useGroupStore } from "@/hooks/useGroup";
import { useTournamentParticipantStore } from "@/hooks/useTournamentParticipant";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
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
  const { hasGroupsForCategory } = useGroupStore();
  const { hasPlayersForCategory } = useTournamentParticipantStore();
  const [hasGroups, setHasGroups] = useState(false);
  const [hasParticipants, setHasParticipants] = useState(false);
  useEffect(() => {
    const fetchGroupAndPlayersStatus = async () => {
      const groupStatus = await hasGroupsForCategory(idTournament, category.id);
      const playersStatus = await hasPlayersForCategory(
        idTournament,
        category.id
      );
      setHasGroups(groupStatus);
      setHasParticipants(playersStatus);
    };
    fetchGroupAndPlayersStatus();
  }, [category.id, hasGroupsForCategory, hasPlayersForCategory, idTournament]);

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
