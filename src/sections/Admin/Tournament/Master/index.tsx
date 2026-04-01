import React, { useState } from "react";
import { Tournament } from "@/types/Tournament/Tournament";
import PlayersTournamentTable from "../Players/Table/table";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import AddCategoriesForTournamentDialog from "../Categories/Add/dialog";
import ConfigureTournamentCategoryDialog from "../Categories/Configure/dialog";
import { useTournamentCategoryMutations } from "@/hooks/Tournament-Category/useTournamentCategory";
import MasterCategoriesCard from "../Fixture/master-card";
import { isGroupStageFixturesCreated } from "@/api/Fixture/is-group-stage-fixtures-created";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/loading";
import { RelatedTournamentsCard, LinkTournamentDialog } from "@/components/Tournament";
import { useAllTournaments } from "@/hooks/Tournament/useTournaments";
import { TournamentType } from "@/common/enum/tournament.enum";
import DirectPlayoffCard from "../Fixture/direct-playoff-card";
import DirectPlayoffRegistration from "../Players/DirectPlayoffRegistration";
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
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  
  // Get Liga tournaments for linking
  const { tournaments: allTournaments } = useAllTournaments();
  const ligaTournaments = allTournaments?.filter(t => 
    t.tournamentType === TournamentType.League && 
    t.id !== tournament.id
  ) || [];

  // Crear función wrapper para el mutation
  const createCategoryForTournament = async (
    idTournament: number,
    idCategory: number[],
    skipGroupStage?: boolean,
    startingPlayoffRound?: any
  ): Promise<TournamentCategory[]> => {
    return await createCategoryForTournamentMutation.mutateAsync({
      idTournament,
      idCategory,
      skipGroupStage,
      startingPlayoffRound
    });
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

  const handleCategoryUpdated = (updatedCategory: TournamentCategory) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
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
      
      {/* Sección de vinculación */}
      <div className="mb-6">
        <RelatedTournamentsCard
          tournament={tournament}
          onLinkClick={() => setIsLinkDialogOpen(true)}
        />
      </div>
      <h1 className="text-lg font-bold m-4 text-orange-700">
        Categorías Inscriptas
      </h1>
      <div className="m-4">
        {categories.map((category) => (
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
            {tournament.status === "pending" && (
              <ConfigureTournamentCategoryDialog
                tournamentId={tournament.id}
                category={category}
                onUpdated={handleCategoryUpdated}
              />
            )}
          </div>
        ))}
        {tournament.status === "pending" && (
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

      {/* Sección de categorías con playoff directo */}
      {categories.some(cat => cat.skipGroupStage) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">
            Categorías - Directo a Playoffs
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
            {categories
              .filter(category => category.skipGroupStage)
              .map((category) => (
                <DirectPlayoffCard
                  key={category.id}
                  category={category}
                  idTournament={tournament.id}
                  onBracketCreated={handleFixtureCreated}
                />
              ))}
          </div>
        </>
      )}

      {/* Sección de categorías con fase de grupos */}
      {categories.some(cat => !cat.skipGroupStage && !finalFixturesCreated[cat.id]) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">Fase de Grupos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
            {categories
              .filter(category => !category.skipGroupStage)
              .map((category) =>
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
        </>
      )}
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

      {/* Inscripción rápida para playoffs directos */}
      {categories.some(cat => cat.skipGroupStage) && (
        <>
          <h1 className="text-lg font-bold m-4 text-orange-700">
            Inscripción Rápida - Playoffs Directos
          </h1>
          <div className="m-4 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-purple-900 mb-2">📋 Instrucciones para Inscripción</h3>
              <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                <li>Selecciona la categoría (solo aparecen las que van directo a playoffs)</li>
                <li>Marca exactamente el número requerido de jugadores según la ronda inicial</li>
                <li>Opcionalmente asigna posiciones para el seeding del bracket</li>
                <li>Una vez inscritos, ve a la sección &quot;Categorías - Directo a Playoffs&quot; arriba para crear el bracket</li>
              </ol>
            </div>
            <DirectPlayoffRegistration
              tournamentId={tournament.id}
              categories={categories}
            />
          </div>
        </>
      )}

      <h1 className="text-lg font-bold m-4 text-orange-700">Jugadores Inscritos</h1>
      <div className="gap-4 m-4">
        <PlayersTournamentTable idTournament={tournament.id} categories={categories} />
      </div>
      
      {/* Dialog de vinculación */}
      <LinkTournamentDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        masterTournament={tournament}
        ligaTournaments={ligaTournaments}
      />
    </div>
  );
}

export default MasterTournamentDetail;
