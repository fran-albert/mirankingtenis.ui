import React, { useState } from "react";
import { Tournament } from "@/types/Tournament/Tournament";
import CategoriesCard from "../Fixture/card";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import ConfigureTournamentCategoryDialog from "../Categories/Configure/dialog";
import { useTournamentCategoryMutations } from "@/hooks/Tournament-Category/useTournamentCategory";
import { useAllCategories } from "@/hooks/Category";
import DirectPlayoffCard from "../Fixture/direct-playoff-card";
import DirectPlayoffRegistration from "../Players/DirectPlayoffRegistration";
function LeagueTournamentDetail({
  tournament,
  categories: initialCategories,
  categoryDates,
}: {
  tournament: Tournament;
  categories: TournamentCategory[];
  categoryDates: any;
}) {
  const { createCategoryForTournamentMutation } = useTournamentCategoryMutations();
  const [categories, setCategories] = useState<TournamentCategory[]>(
    initialCategories || []
  );

  // Ya no es necesario useEffect - React Query manejará la actualización automáticamente

  const handleCategoryAdded = async (newCategories: TournamentCategory[]) => {
    setCategories([...categories, ...newCategories]);
  };

  const handleCategoryUpdated = (updatedCategory: TournamentCategory) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  // Crear función wrapper para el mutation
  const createCategoryForTournament = async (
    idTournament: number,
    idCategory: number[],
    skipGroupStage?: boolean,
    startingPlayoffRound?: TournamentCategory["startingPlayoffRound"]
  ): Promise<TournamentCategory[]> => {
    return await createCategoryForTournamentMutation.mutateAsync({
      idTournament,
      idCategory,
      skipGroupStage,
      startingPlayoffRound,
    });
  };

  const existingCategoryIds = categories.map((category) => category.id);

  // Calcular si hay categorías disponibles para agregar
  const { categories: allCategories } = useAllCategories();
  const availableCategories = allCategories.filter(
    (category) => !existingCategoryIds.includes(category.id)
  );
  const hasAvailableCategories = availableCategories.length > 0;

  return (
    <div>
      {/* <TournamentBreadcrumb /> */}
      <h1 className="text-2xl font-bold mb-4 text-lime-800">
        {tournament.name} - Configuración
      </h1>
      <h1 className="text-lg font-bold m-4 text-orange-700">
        Categorías Inscriptas
      </h1>
      <div className="m-4">
        {categories?.map((category) => (
          <div
            className="flex items-center justify-between gap-3 py-1"
            key={category.id}
          >
            <div className="font-bold">
              Categoría {category.name}
              {category.skipGroupStage && (
                <span className="ml-2 text-sm font-medium text-purple-700">
                  • Directo a {category.startingPlayoffRound === "RoundOf16"
                    ? "Octavos"
                    : category.startingPlayoffRound === "QuarterFinals"
                      ? "Cuartos"
                      : category.startingPlayoffRound === "SemiFinals"
                        ? "Semifinales"
                        : "Final"}
                </span>
              )}
            </div>
            {tournament?.status === "pending" && (
              <ConfigureTournamentCategoryDialog
                tournamentId={tournament.id}
                category={category}
                onUpdated={handleCategoryUpdated}
              />
            )}
          </div>
        ))}
        {tournament?.status === "pending" && hasAvailableCategories && (
          <div className="m-4">
            <AddCategoriesForTournamentDialog
              idTournament={tournament.id}
              existingCategories={existingCategoryIds}
              createCategoryForTournament={createCategoryForTournament}
              onClose={handleCategoryAdded}
              enableDirectPlayoffConfiguration={true}
            />
          </div>
        )}
      </div>

      {categories.some((category) => category.skipGroupStage) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">
            Categorías - Directo a Playoffs
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
            {categories
              .filter((category) => category.skipGroupStage)
              .map((category) => (
                <DirectPlayoffCard
                  key={category.id}
                  category={category}
                  idTournament={tournament.id}
                />
              ))}
          </div>
        </>
      )}

      {categories.some((category) => !category.skipGroupStage) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">Fixture</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
            {tournament?.type === "league" &&
              categories
                ?.filter((category) => !category.skipGroupStage)
                .map((category) => (
                  <CategoriesCard
                    key={category.id}
                    idTournament={tournament.id}
                    category={category}
                    nextMatchDay={categoryDates[category.id]}
                  />
                ))}
          </div>
        </>
      )}

      {categories.some((category) => category.skipGroupStage) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">
            Inscripción Rápida - Playoffs Directos
          </h1>
          <div className="m-4 mb-8">
            <DirectPlayoffRegistration
              tournamentId={tournament.id}
              categories={categories}
            />
          </div>
        </>
      )}

      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores</h1>
      <div className="gap-4">
        <PlayersTournamentTable
          idTournament={tournament.id}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default LeagueTournamentDetail;
