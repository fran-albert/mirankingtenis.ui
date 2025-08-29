import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { useUserTrophyCount } from "@/hooks/Trophy";
import { useTournamentsByUser } from "@/hooks/Tournament/useTournamentsByUser";
import { TrophyHistoryModal } from "@/components/Trophy";
import { Trophy, Target } from "lucide-react";
function StatisticsByPlayer({
  matchSummary,
  category,
  initialPosition,
  bestPosition,
  userId,
  userName,
}: {
  matchSummary: MatchSummaryDto | undefined;
  category: string;
  bestPosition: number;
  initialPosition: number;
  userId: number;
  userName: string;
}) {
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);
  const { data: trophyCount = 0 } = useUserTrophyCount(userId);
  const { data: tournamentCount = 0 } = useTournamentsByUser(userId);
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
        
        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div 
            className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 cursor-pointer transition-all hover:bg-yellow-100 hover:shadow-md"
            onClick={() => setIsTrophyModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{trophyCount}</div>
            </div>
            <div className="text-sm text-yellow-700">Trofeos Totales</div>
            <div className="text-xs text-yellow-600 mt-1 opacity-75">
              Click para ver historial
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{tournamentCount}</div>
            </div>
            <div className="text-sm text-green-700">Torneos Jugados</div>
          </div>
        </div>
      </CardContent>

      {/* Modal de historial de trofeos */}
      <TrophyHistoryModal
        open={isTrophyModalOpen}
        onOpenChange={setIsTrophyModalOpen}
        userId={userId}
        userName={userName}
      />
    </Card>
  );
}

export default StatisticsByPlayer;
