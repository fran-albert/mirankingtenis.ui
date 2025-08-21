import React, { useEffect, useState } from "react";
import { Tournament } from "@/types/Tournament/Tournament";
import CategoriesCard from "../Fixture/card";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import { useTournamentCategoryMutations } from "@/hooks/Tournament-Category/useTournamentCategory";
import MasterCategoriesCard from "../Fixture/master-card";
import { useFixtureStore } from "@/hooks/useFixture";
import Loading from "@/components/Loading/loading";
import PlayOffCategoriesCard from "../Fixture/playoff-card";
function MasterTournamentDetail({
  tournament,
  categories: initialCategories,
}: {
  tournament: Tournament;
  categories: TournamentCategory[];
}) {
  const { createCategoryForTournamentMutation } = useTournamentCategoryMutations();
  const [categories, setCategories] = useState<TournamentCategory[]>(
    initialCategories || []
  );

  // Crear función wrapper para el mutation
  const createCategoryForTournament = async (idTournament: number, idCategory: number[]): Promise<TournamentCategory[]> => {
    return await createCategoryForTournamentMutation.mutateAsync({ idTournament, idCategory });
  };
  const { isGroupStageFixturesCreated, loading: isLoadingFixture } =
    useFixtureStore();
  const [groupStageFixturesCreated, setGroupStageFixturesCreated] = useState<{
    [key: number]: boolean;
  }>({});

  const handleFixtureCreated = (idCategory: number) => {
    setGroupStageFixturesCreated((prev) => ({
      ...prev,
      [idCategory]: true,
    }));
  };

  // Ya no es necesario useEffect para categorías - se pasan como prop

  useEffect(() => {
    const checkFixtures = async () => {
      if (categories.length > 0) {
        const results = await Promise.all(
          categories.map((category) =>
            isGroupStageFixturesCreated(tournament.id, Number(category.id))
          )
        );
        const newFixturesCreated = categories.reduce((acc, category, index) => {
          acc[category.id] = results[index];
          return acc;
        }, {} as { [key: number]: boolean });
        setGroupStageFixturesCreated(newFixturesCreated);
      }
    };

    checkFixtures();
  }, [categories, tournament.id, isGroupStageFixturesCreated]);

  const handleCategoryAdded = async (newCategories: TournamentCategory[]) => {
    setCategories([...categories, ...newCategories]);
  };

  const existingCategoryIds = categories.map((category) => category.id);

  if (isLoadingFixture) {
    return <Loading isLoading />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-lime-800">
        {tournament.name} - Configuración
      </h1>
      <h1 className="text-lg font-bold m-4 text-orange-700">
        Categorías Inscriptas
      </h1>
      <div className="m-4">
        {categories.map((category) => (
          <li className="font-bold" key={category.id}>
            Categoría {category.name}
          </li>
        ))}
        {tournament.status === "pending" && (
          <div className="m-4">
            <AddCategoriesForTournamentDialog
              idTournament={tournament.id}
              existingCategories={existingCategoryIds}
              createCategoryForTournament={createCategoryForTournament}
              onClose={handleCategoryAdded}
            />
          </div>
        )}
      </div>

      <h1 className="text-lg font-bold m-4 text-orange-700">Fase de Grupos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) =>
          !groupStageFixturesCreated[category.id] ? (
            <MasterCategoriesCard
              key={category.id}
              onFixtureCreated={handleFixtureCreated}
              idTournament={tournament.id}
              category={category}
            />
          ) : null
        )}
      </div>
      {/* <h1 className="text-lg font-bold m-4 text-orange-700">PlayOffs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <PlayOffCategoriesCard
            idTournament={tournament.id}
            key={category.id}
            onFixtureCreated={handleFixtureCreated}
            category={category}
          />
        ))}
      </div> */}
      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores</h1>
      <div className="gap-4">
        <PlayersTournamentTable idTournament={tournament.id} />
      </div>
    </div>
  );
}

export default MasterTournamentDetail;
