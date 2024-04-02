import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { getRankingByCategory } from "@/modules/ranking/application/get-by-category/getRankingByCategory";

export const RankingTable = ({
  selectedCategory,
}: {
  selectedCategory: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const rankingRepository = useMemo(() => createApiRankingRepositroy(), []);
  const loadRanking = useMemo(
    () => getRankingByCategory(rankingRepository),
    [rankingRepository]
  );

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true);
        const rankingData = await loadRanking(selectedCategory);
        setRanking(rankingData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [selectedCategory, loadRanking]);

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
