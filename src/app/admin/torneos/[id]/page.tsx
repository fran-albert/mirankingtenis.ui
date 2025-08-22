"use client";
import Loading from "@/components/Loading/loading";
import { useTournament } from "@/hooks/Tournament/useTournament";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategory";
import { getCountFixturesByTournamentCategory } from "@/api/Fixture/get-count-fixtures-by-tournament-category";
import DetailsTournament from "@/sections/Admin/Tournament/Details/page";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";

function TournamentDetailsPage() {
  const params = useParams();
  const idTournament = Number(params.id);
  
  // Usar React Query hooks
  const { tournament, isLoading: isTournamentLoading } = useTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });
  
  const { categories: categoriesForTournaments, isLoading: isCategoriesLoading } = useCategoriesForTournament({ 
    idTournament, 
    enabled: !!idTournament 
  });

  // Usar useQuery para obtener todos los conteos de fixtures de una vez
  const { data: categoryDates = {}, isLoading: isFixtureCountsLoading } = useQuery({
    queryKey: ['fixture-counts', idTournament, categoriesForTournaments?.map(c => c.id)],
    queryFn: async () => {
      if (!categoriesForTournaments || categoriesForTournaments.length === 0) {
        return {};
      }
      
      const dates: { [key: number]: number } = {};
      await Promise.all(
        categoriesForTournaments.map(async (category) => {
          const count = await getCountFixturesByTournamentCategory(category.id, idTournament);
          dates[category.id] = count + 1;
        })
      );
      return dates;
    },
    enabled: !!idTournament && !!categoriesForTournaments && categoriesForTournaments.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  if (isTournamentLoading || isCategoriesLoading || isFixtureCountsLoading || !tournament || !categoriesForTournaments) {
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
