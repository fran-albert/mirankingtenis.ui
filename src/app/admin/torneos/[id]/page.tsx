"use client";
import Loading from "@/components/Loading/loading";
import { useTournament } from "@/hooks/Tournament/useTournament";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategory";
import { getFixtureByCategoryAndTournament } from "@/modules/fixture/application/get-fixture-by-category-and-tournament/getFixtureByCategoryAndTournament";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import DetailsTournament from "@/sections/Admin/Tournament/Details/page";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function TournamentDetailsPage() {
  const params = useParams();
  const idTournament = Number(params.id);
  const [categoryDates, setCategoryDates] = useState<{ [key: number]: any }>(
    {}
  );
  const fixtureRepository = useMemo(() => createApiFixtureRepository(), []);
  
  // Usar React Query hooks
  const { tournament, isLoading: isTournamentLoading } = useTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  
  const { categories: categoriesForTournaments, isLoading: isCategoriesLoading } = useCategoriesForTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  const loadFixture = useCallback(
    (idCategory: number, idTournament: number) =>
      getFixtureByCategoryAndTournament(fixtureRepository)(
        idCategory,
        idTournament
      ),
    [fixtureRepository]
  );

  useEffect(() => {
    const fetchFixtures = async () => {
      if (!categoriesForTournaments || categoriesForTournaments.length === 0) return;
      
      try {
        const dates: { [key: number]: any } = {};
        await Promise.all(
          categoriesForTournaments.map(async (category) => {
            const numberOfFixtures = await loadFixture(
              category.id,
              idTournament
            );
            dates[category.id] = numberOfFixtures + 1;
          })
        );
        setCategoryDates(dates);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFixtures();
  }, [categoriesForTournaments, idTournament, loadFixture]);

  if (isTournamentLoading || isCategoriesLoading || !tournament || !categoriesForTournaments) {
    return <Loading isLoading />;
  }

  return (
    <DetailsTournament
      tournament={tournament}
      categories={categoriesForTournaments}
      categoryDates={categoryDates}
    />
  );
}

export default TournamentDetailsPage;
