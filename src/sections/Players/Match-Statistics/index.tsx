import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { SetSummaryDto } from "@/common/types/set-summary.dto";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
function MatchStatistics({
  matchSummary,
  setSummary,
}: {
  matchSummary: MatchSummaryDto | undefined;
  setSummary: SetSummaryDto | undefined;
}) {
  return (
    <>
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {matchSummary && setSummary ? (
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
                    <p className="font-medium">{setSummary?.totalSetsWon}</p>
                  </div>
                  <div>
                    <p className="text-gray-500  mb-1">Total Sets Perdidos</p>
                    <p className="font-medium">{setSummary?.totalSetsLost}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 ">No hay estadísticas disponibles.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default MatchStatistics;
