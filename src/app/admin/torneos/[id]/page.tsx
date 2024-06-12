"use client";
import Loading from "@/components/Loading/loading";
import { getAllCategories } from "@/modules/category/application/get-all/getAllCategories";
import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { getFixtureByCategoryAndTournament } from "@/modules/fixture/application/get-fixture-by-category-and-tournament/getFixtureByCategoryAndTournament";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import { getCategoriesForTournament } from "@/modules/tournament-category/application/get-categories-for-tournament/getCategoriesForTournament";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import { createApiTournamentCategoryRepository } from "@/modules/tournament-category/infra/ApiTournamentCategoryRepository";
import { getTournament } from "@/modules/tournament/application/get/get";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import DetailsTournament from "@/sections/Admin/Tournament/Details/page";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function TournamentDetailsPage() {
  const params = useParams();
  const idTournament = Number(params.id);
  const [tournament, setTournament] = useState<Tournament>();
  const [categories, setCategories] = useState<
    TournamentCategory[] | undefined
  >(undefined);
  const [matchDay, setMatchDay] = useState<number>();
  const tournamentRepository = useMemo(
    () => createApiTournamentRepository(),
    []
  );
  const fixtureRepository = useMemo(() => createApiFixtureRepository(), []);
  const categoryRepository = useMemo(
    () => createApiTournamentCategoryRepository(),
    []
  );
  const loadTournament = useCallback(
    (id: number) => getTournament(tournamentRepository)(id),
    [tournamentRepository]
  );
  const [categoryDates, setCategoryDates] = useState({});
  const loadFixture = useCallback(
    (idCategory: number, idTournament: number) =>
      getFixtureByCategoryAndTournament(fixtureRepository)(
        idCategory,
        idTournament
      ),
    [tournamentRepository]
  );
  const loadCategories = useCallback(
    getCategoriesForTournament(categoryRepository),
    [tournamentRepository]
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tournamentData = await loadTournament(idTournament);
        const categoriesData = await loadCategories(idTournament);
        const dates: { [key: number]: any } = {};

        await Promise.all(
          categoriesData.map(async (category) => {
            const numberOfFixtures = await loadFixture(
              category.idCategory,
              idTournament
            );
            dates[category.idCategory] = numberOfFixtures + 1;
          })
        );

        setTournament(tournamentData);
        setCategories(categoriesData);
        setCategoryDates(dates);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [idTournament, loadTournament, loadCategories, loadFixture]);

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <DetailsTournament
      tournament={tournament}
      categories={categories}
      categoryDates={categoryDates}
      idTournament={idTournament}
    />
  );
}

export default TournamentDetailsPage;
