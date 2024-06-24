import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";
function StatisticsByPlayer({
  matchSummary,
  category,
  initialPosition,
  bestPosition,
}: {
  matchSummary: MatchSummaryDto | undefined;
  category: string;
  bestPosition: number;
  initialPosition: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas del Torneo</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">
              {matchSummary?.totalPlayed}
            </div>
            <div className="text-sm text-muted-foreground">
              Partidos Jugados
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{matchSummary?.totalWon}</div>
            <div className="text-sm text-muted-foreground">
              Partidos Ganados
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{matchSummary?.totalLost}</div>
            <div className="text-sm text-muted-foreground">
              Partidos Perdidos
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{matchSummary?.winRate}</div>
            <div className="text-sm text-muted-foreground">
              Porcentaje de Victorias
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{initialPosition}</div>
            <div className="text-sm text-muted-foreground">
              Posición Inicial
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{bestPosition}</div>
            <div className="text-sm text-muted-foreground">Mejor Posición</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-xl font-bold">{category}</div>
            <div className="text-sm text-muted-foreground">Categoría</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatisticsByPlayer;
