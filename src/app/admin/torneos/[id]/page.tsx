"use client";
import Loading from "@/components/Loading/loading";
import { useTournamentStore } from "@/hooks/useTournament";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fixtureRepository = useMemo(() => createApiFixtureRepository(), []);
  const { tournament, getTournament } = useTournamentStore();
  const { categoriesForTournaments, getCategoriesForTournament } =
    useTournamentCategoryStore();
  const loadFixture = useCallback(
    (idCategory: number, idTournament: number) =>
      getFixtureByCategoryAndTournament(fixtureRepository)(
        idCategory,
        idTournament
      ),
    [fixtureRepository]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategoriesForTournament(idTournament);
        const dates: { [key: number]: any } = {};
        getTournament(idTournament);
        await Promise.all(
          categoriesData.map(async (category) => {
            const numberOfFixtures = await loadFixture(
              category.id,
              idTournament
            );
            dates[category.id] = numberOfFixtures + 1;
          })
        );
        setCategoryDates(dates);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idTournament, getTournament, getCategoriesForTournament, loadFixture]);

  if (isLoading) {
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
