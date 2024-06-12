import React, { useEffect } from "react";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { TournamentBreadcrumb } from "@/components/Breadcrumb/Tournament";
import CategoriesCard from "../Fixture/card";
import { Category } from "@/modules/category/domain/Category";
import AdminPlayersTanstackTable from "../../Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
function DetailsTournament({
  tournament,
  categories,
  categoryDates,
  idTournament,
}: {
  tournament: Tournament | undefined;
  categories: TournamentCategory[] | undefined;
  categoryDates: any;
  idTournament: number;
}) {
  const {
    loading,
    error,
    getCategoriesForTournament,
    createCategoryForTournament,
  } = useTournamentCategoryStore();

  useEffect(() => {
    getCategoriesForTournament(idTournament);
  }, [idTournament]);

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
          <li className="font-bold" key={category.idCategory}>
            Categoría {category.nameCategory}
          </li>
        ))}
        {tournament?.status === "pending" && (
          <div className="m-4">
            <AddCategoriesForTournamentDialog
              idTournament={idTournament}
              createCategoryForTournament={createCategoryForTournament}
            />
          </div>
        )}
      </div>
      <h1 className="text-lg font-bold m-4 text-orange-700">Fixture</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <CategoriesCard
            key={category.idCategory}
            idTournament={idTournament}
            category={category}
            nextMatchDay={categoryDates[category.idCategory]}
          />
        ))}
      </div>
      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores</h1>
      <div className="gap-4">
        <PlayersTournamentTable idTournament={idTournament} />
      </div>
    </div>
  );
}

export default DetailsTournament;
