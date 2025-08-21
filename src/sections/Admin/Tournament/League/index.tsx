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

  // Crear función wrapper para el mutation
  const createCategoryForTournament = async (idTournament: number, idCategory: number[]): Promise<TournamentCategory[]> => {
    return await createCategoryForTournamentMutation.mutateAsync({ idTournament, idCategory });
  };

  const existingCategoryIds = categories.map((category) => category.id);

  // Ya no es necesario el loading state - las categorías se pasan como prop

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
          <li className="font-bold" key={category.id}>
            Categoría {category.name}
          </li>
        ))}
        {tournament?.status === "pending" && (
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

      <h1 className="text-lg font-bold m-4 text-orange-700">Fixture</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournament?.type === "league" && (
          <>
            {categories?.map((category) => (
              <CategoriesCard
                key={category.id}
                idTournament={tournament.id}
                category={category}
                nextMatchDay={categoryDates[category.id]}
              />
            ))}
          </>
        )}
      </div>

      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores</h1>
      <div className="gap-4">
        <PlayersTournamentTable idTournament={tournament.id} />
      </div>
    </div>
  );
}

export default LeagueTournamentDetail;
