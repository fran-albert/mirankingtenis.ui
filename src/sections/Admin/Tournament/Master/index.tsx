import React, { useEffect, useState } from "react";
import { Tournament } from "@/types/Tournament/Tournament";
import CategoriesCard from "../Fixture/card";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import { useTournamentCategoryMutations } from "@/hooks/Tournament-Category/useTournamentCategory";
import MasterCategoriesCard from "../Fixture/master-card";
import { isGroupStageFixturesCreated } from "@/api/Fixture/is-group-stage-fixtures-created";
import { useQuery } from "@tanstack/react-query";
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
  const [manualFixturesCreated, setManualFixturesCreated] = useState<{
    [key: number]: boolean;
  }>({});

  const handleFixtureCreated = (idCategory: number) => {
    setManualFixturesCreated((prev) => ({
      ...prev,
      [idCategory]: true,
    }));
  };

  // Usar useQuery para obtener todos los estados de fixtures de una vez
  const { data: groupStageFixturesCreated = {}, isLoading: isLoadingFixture } = useQuery({
    queryKey: ['group-stage-fixtures-created', tournament.id, categories.map(c => c.id)],
    queryFn: async () => {
      if (!categories || categories.length === 0) {
        return {};
      }
      
      const results: { [key: number]: boolean } = {};
      await Promise.all(
        categories.map(async (category) => {
          const isCreated = await isGroupStageFixturesCreated(tournament.id, Number(category.id));
          results[category.id] = isCreated;
        })
      );
      return results;
    },
    enabled: !!tournament.id && !!categories && categories.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Combinar los estados: usar manual override si existe, sino usar el del query
  const finalFixturesCreated = React.useMemo(() => {
    const combined = { ...groupStageFixturesCreated };
    Object.entries(manualFixturesCreated).forEach(([key, value]) => {
      if (value) combined[Number(key)] = true;
    });
    return combined;
  }, [groupStageFixturesCreated, manualFixturesCreated]);

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
          !finalFixturesCreated[category.id] ? (
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
