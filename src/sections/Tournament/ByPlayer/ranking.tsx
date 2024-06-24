import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { HistoryRankingDto } from "@/common/types/history-ranking.dto";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
function ChartRankingByPlayer({
  historyRanking,
}: {
  historyRanking: HistoryRankingDto[];
}) {
  return (
    <>
      <PlayerChart player={historyRanking} tournamentCategoryId={1} />
    </>
  );
}

export default ChartRankingByPlayer;
