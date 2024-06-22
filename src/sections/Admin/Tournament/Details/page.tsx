import React, { useEffect, useState } from "react";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import CategoriesCard from "../Fixture/card";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import MasterCategoriesCard from "../Fixture/master-card";
import { useFixtureStore } from "@/hooks/useFixture";
import Loading from "@/components/Loading/loading";
function DetailsTournament({
  tournament,
  categories: initialCategories,
  categoryDates,
  idTournament,
}: {
  tournament: Tournament | undefined;
  categories: TournamentCategory[] | undefined;
  categoryDates: any;
  idTournament: number;
}) {
  const {
    loading: isLoadingCategories,
    error,
    getCategoriesForTournament,
    createCategoryForTournament,
  } = useTournamentCategoryStore();
  const [categories, setCategories] = useState<TournamentCategory[]>(
    initialCategories || []
  );
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

  useEffect(() => {
    const checkFixtures = async () => {
      if (categories) {
        const results = await Promise.all(
          categories.map((category) =>
            isGroupStageFixturesCreated(idTournament, Number(category.id))
          )
        );
        const newFixturesCreated = categories.reduce((acc, category, index) => {
          acc[category.id] = results[index];
          return acc;
        }, {} as { [key: number]: boolean });
        setGroupStageFixturesCreated(newFixturesCreated);
      }
    };
    getCategoriesForTournament(idTournament);
    checkFixtures();
  }, [idTournament, categories, getCategoriesForTournament, isGroupStageFixturesCreated]);

  const handleCategoryAdded = (newCategories: TournamentCategory[]) => {
    setCategories((prevCategories) => [...prevCategories, ...newCategories]);
  };

  const existingCategoryIds = categories.map((category) => category.id);

  if (isLoadingCategories || isLoadingFixture) {
    return <Loading isLoading />;
  }

  return (
    <div>
      {/* <TournamentBreadcrumb /> */}
      <h1 className="text-2xl font-bold mb-4 text-lime-800">
        {tournament?.name} - Configuración
      </h1>
      <h1 className="text-lg font-bold m-4 text-orange-700">
        Categorías Inscriptas
      </h1>
      <div className="m-4">
        {categories?.map((category) => (
          <li className="font-bold" key={category.id}>
            Categoría {category.name}
          </li>
        ))}
        {tournament?.status === "pending" && (
          <div className="m-4">
            <AddCategoriesForTournamentDialog
              idTournament={idTournament}
              existingCategories={existingCategoryIds}
              createCategoryForTournament={createCategoryForTournament}
              onClose={handleCategoryAdded}
            />
          </div>
        )}
      </div>
      <h1 className="text-lg font-bold m-4 text-orange-700">Fixture</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournament?.type === "master" && (
          <>
            {categories?.map((category) =>
              !groupStageFixturesCreated[category.id] ? (
                <MasterCategoriesCard
                  key={category.id}
                  onFixtureCreated={handleFixtureCreated}
                  idTournament={idTournament}
                  category={category}
                  nextMatchDay={categoryDates[category.id]}
                />
              ) : null
            )}
          </>
        )}
        {tournament?.type === "league" && (
          <>
            {categories?.map((category) => (
              <CategoriesCard
                key={category.id}
                idTournament={idTournament}
                category={category}
                nextMatchDay={categoryDates[category.id]}
              />
            ))}
          </>
        )}
      </div>
      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores</h1>
      <div className="gap-4">
        <PlayersTournamentTable idTournament={idTournament} />
      </div>
    </div>
  );
}

export default DetailsTournament;
