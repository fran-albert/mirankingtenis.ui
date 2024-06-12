import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { getRankingByCategory } from "@/modules/ranking/application/get-by-category/getRankingByCategory";
import { useTournamentRankingStore } from "@/hooks/useTournamentRanking";

export const RankingTable = ({
  tournamentCategoryId,
  idCategory,
  idTournament,
}: {
  tournamentCategoryId: number;
  idCategory: number;
  idTournament: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  // const [ranking, setRanking] = useState<Ranking[]>([]);
  // const rankingRepository = useMemo(() => createApiRankingRepositroy(), []);
  // const loadRanking = useMemo(
  //   () => getRankingByCategory(rankingRepository),
  //   [rankingRepository]
  // );

  const { getAllRankingsByTournamentCategory, ranking, loading } =
    useTournamentRankingStore();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true);
        const ranking = await getAllRankingsByTournamentCategory(
          idTournament,
          idCategory
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [idTournament, idCategory, getAllRankingsByTournamentCategory]);

  const rankingColumns = getColumns();

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <>
      <DataTable columns={rankingColumns} data={ranking} />
    </>
  );
};
