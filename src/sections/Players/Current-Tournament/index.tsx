import { getInitials } from "@/common/helpers/helpers";
import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import { NextMatchDto } from "@/common/types/next-match.dto";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateDays } from "@/lib/utils";
import { Tournament } from "@/types/Tournament/Tournament";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function CurrentTournament({
  playerInfo,
  currentTournaments,
  nextMatch,
  playerId,
}: {
  playerInfo: GetPlayerInfoDto;
  nextMatch: NextMatchDto | undefined;
  currentTournaments: Tournament;
  playerId: number;
}) {
  const winRate =
    playerInfo && playerInfo.ranking && playerInfo.ranking.playedMatches > 0
      ? (playerInfo.ranking.wonMatches / playerInfo.ranking.playedMatches) * 100
      : 0;

  return (
    <div>
      <Card className="w-full max-w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Torneo Actual</CardTitle>
            {currentTournaments && (
              <Link href={`/jugadores/${playerId}/torneos/${currentTournaments.id}`}>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {currentTournaments ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {currentTournaments?.name}
                  </h3>
                  <p className="text-gray-500 ">
                    {formatDateDays(currentTournaments?.startedAt)} -{" "}
                    {currentTournaments?.finishedAt}
                  </p>
                </div>
                <div>
                  <p className="font-bold">
                    {playerInfo?.ranking?.position}° -{" "}
                    {playerInfo?.tournamentCategory?.name}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="mt-4">
                <h4 className="text-gray-500  mb-2">Estadísticas</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ganados</p>
                    <p className="text-gray-500  text-sm">
                      {playerInfo?.ranking?.wonMatches}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Perdidos</p>
                    <p className="text-gray-500  text-sm">
                      {playerInfo?.ranking?.lostMatches}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Victorias %</p>
                    <p className="text-gray-500  text-sm">{winRate}%</p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                {nextMatch ? (
                  <div className="grid gap-4">
                    <h4 className="text-gray-500  mb-2">Próximo Partido</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <OptimizedAvatar
                          src={nextMatch?.user1.photo}
                          alt={`${nextMatch?.user1.name} ${nextMatch?.user1.lastname}`}
                          size="thumbnail"
                        />
                        <div>
                          <p className="font-medium">
                            {nextMatch?.user1.name} {nextMatch?.user1.lastname}
                          </p>
                          <p className="text-gray-500  text-sm">
                            {nextMatch?.user1.position}°
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{nextMatch?.user2 ? "vs" : "Libre"}</p>
                        {nextMatch?.user2 && (
                          <p className="text-gray-500  text-sm">
                            {nextMatch?.shift === null
                              ? "Sin horario"
                              : formatDate(String(nextMatch?.shift.startHour))}
                          </p>
                        )}
                      </div>
                      {nextMatch?.user2 ? (
                        <div className="flex items-center gap-2">
                          <OptimizedAvatar
                            src={nextMatch.user2.photo}
                            alt={`${nextMatch.user2.name} ${nextMatch.user2.lastname}`}
                            size="thumbnail"
                          />
                          <div>
                            <p className="font-medium">
                              {nextMatch.user2.name} {nextMatch.user2.lastname}
                            </p>
                            <p className="text-gray-500  text-sm">
                              {nextMatch.user2.position}°
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full w-8 h-8 bg-green-100  flex items-center justify-center text-sm font-bold text-green-600">
                            ✓
                          </div>
                          <div>
                            <p className="font-medium text-green-600">
                              Fecha libre
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500  text-sm">
                    No hay próximos partidos asignados.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 ">
                    No está disputando ningún torneo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CurrentTournament;
