import { useEffect, useState } from "react";
import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { createApiRankingRepositroy } from "@/modules/ranking/infra/ApiRankingRepository";
import { get } from "@/modules/ranking/application/get/getRanking";

export const RankingTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const rankingRepository = createApiRankingRepositroy();
  const loadRanking = get(rankingRepository);

  const fetchRanking = async () => {
    try {
      setIsLoading(true);
      const rankingData = await loadRanking();
      setRanking(rankingData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const rankingColumns = getColumns(fetchRanking);

  useEffect(() => {
    fetchRanking();
  }, []);

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <>
      <h1 className="text-2xl text-center font-medium mb-4">Ranking</h1>
      <DataTable columns={rankingColumns} data={ranking} />
    </>
  );
};
