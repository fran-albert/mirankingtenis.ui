import Loading from "@/components/Loading/loading";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { useTournamentRanking } from "@/hooks/Tournament-Ranking/useTournamentRanking";

export const RankingTable = ({
  tournamentCategoryId,
  idCategory,
  idTournament,
}: {
  tournamentCategoryId: number;
  idCategory: number;
  idTournament: number;
}) => {
  const { rankings, isLoading, isError, error } = useTournamentRanking({
    idTournament,
    idCategory,
  });

  const rankingColumns = getColumns();

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  if (isError) {
    console.error("Error loading rankings:", error);
    return <div>Error al cargar los rankings</div>;
  }

  return <DataTable columns={rankingColumns} data={rankings} />;
};
