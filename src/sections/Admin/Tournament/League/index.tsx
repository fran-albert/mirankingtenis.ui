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
  const {
    loading: isLoadingCategories,
    error,
    getCategoriesForTournament,
    createCategoryForTournament,
  } = useTournamentCategoryStore();
  const [categories, setCategories] = useState<TournamentCategory[]>(
    initialCategories || []
  );

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const fetchedCategories = await getCategoriesForTournament(tournament.id);
      setCategories(fetchedCategories);
    };

    fetchAndSetCategories();
  }, [tournament.id, getCategoriesForTournament]);

  const handleCategoryAdded = async (newCategories: TournamentCategory[]) => {
    const fetchedCategories = await getCategoriesForTournament(tournament.id);
    setCategories(fetchedCategories);
  };

  const existingCategoryIds = categories.map((category) => category.id);

  if (isLoadingCategories) {
    return <Loading isLoading />;
  }

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
