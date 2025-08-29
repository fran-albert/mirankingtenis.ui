import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { SetSummaryDto } from "@/common/types/set-summary.dto";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUserTrophies, useUserTrophyCount } from "@/hooks/Trophy";
import { useTournamentsByUser } from "@/hooks/Tournament/useTournamentsByUser";
import { useGlobalPlayerSetSummary } from "@/hooks/Sets/useGlobalSetSummary";
import { TrophyHistoryModal } from "@/components/Trophy";
import { Trophy, Target } from "lucide-react";
import { useState } from "react";
function MatchStatistics({
  matchSummary,
  setSummary,
  userId,
  userName,
}: {
  matchSummary: MatchSummaryDto | undefined;
  setSummary: SetSummaryDto | undefined;
  userId: number;
  userName: string;
}) {
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);
  const { data: trophyCount = 0 } = useUserTrophyCount(userId);
  const { data: tournamentCount = 0 } = useTournamentsByUser(userId);
  const { data: globalSetSummary } = useGlobalPlayerSetSummary(userId);
  return (
    <>
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {matchSummary || globalSetSummary ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-2">General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500  mb-1">Partidos Jugados</p>
                    <p className="font-medium">{matchSummary?.totalPlayed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">Ganados</p>
                    <p className="font-medium">{matchSummary?.totalWon}</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">Perdidos</p>
                    <p className="font-medium">{matchSummary?.totalLost}</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">
                      Porcentaje de Victorias
                    </p>
                    <p className="font-medium">{matchSummary?.winRate}</p>
                  </div>
                </div>
              </div>
              {/* <div>
                <h3 className="text-lg font-bold mb-2">Mi Ranking Tenis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500  mb-1">
                      Títulos
                    </p>
                    <p className="font-medium">20</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">
                      Finales
                    </p>
                    <p className="font-medium">31</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">
                      Semifinales
                    </p>
                    <p className="font-medium">46</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">
                      Cuartos de Final
                    </p>
                    <p className="font-medium">58</p>
                  </div>
                </div>
              </div> */}
              <div>
                <h3 className="text-lg font-bold mb-2">Otras Estadísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500  mb-1">Total Sets Ganados</p>
                    <p className="font-medium">{globalSetSummary?.totalSetsWon || setSummary?.totalSetsWon || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">Total Sets Perdidos</p>
                    <p className="font-medium">{globalSetSummary?.totalSetsLost || setSummary?.totalSetsLost || 0}</p>
                  </div>
                  <div 
                    className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 cursor-pointer transition-all hover:bg-yellow-100 hover:shadow-md"
                    onClick={() => setIsTrophyModalOpen(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <div className="text-2xl font-bold text-yellow-600">{trophyCount}</div>
                    </div>
                    <div className="text-sm text-yellow-700">Trofeos Ganados</div>
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
              </div>
            </div>
          ) : (
            <p className="text-gray-500 ">No hay estadísticas disponibles.</p>
          )}
        </CardContent>
      </Card>

      {/* Modal de historial de trofeos */}
      <TrophyHistoryModal
        open={isTrophyModalOpen}
        onOpenChange={setIsTrophyModalOpen}
        userId={userId}
        userName={userName}
      />
    </>
  );
}

export default MatchStatistics;
