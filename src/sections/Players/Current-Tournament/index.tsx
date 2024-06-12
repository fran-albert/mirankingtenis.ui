import { formatDateToSpanish, getInitials } from "@/common/helpers/helpers";
import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import { NextMatchDto } from "@/common/types/next-match.dto";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateComplete } from "@/lib/utils";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import React from "react";

function CurrentTournament({
  playerInfo,
  currentTournaments,
  nextMatch,
}: {
  playerInfo: GetPlayerInfoDto | null;
  nextMatch: NextMatchDto | undefined;
  currentTournaments: Tournament;
}) {
  const winRate =
    playerInfo && playerInfo.ranking && playerInfo.ranking.playedMatches > 0
      ? (playerInfo.ranking.wonMatches / playerInfo.ranking.playedMatches) * 100
      : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Torneo Actual</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{currentTournaments?.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {currentTournaments?.startedAt} - {currentTournaments?.finishedAt}
            </p>
          </div>
          <div>
            <p className="font-bold">
              {playerInfo?.ranking.position}° -{" "}
              {playerInfo?.tournamentCategory.name}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="mt-4">
          <h4 className="text-gray-500 dark:text-gray-400 mb-2">
            Estadísticas
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ganados</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {playerInfo?.ranking.wonMatches}
              </p>
            </div>
            <div>
              <p className="font-medium">Perdidos</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {playerInfo?.ranking.lostMatches}
              </p>
            </div>
            <div>
              <p className="font-medium">Victorias %</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {winRate}%
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          {nextMatch ? (
            <div className="grid gap-4">
              <h4 className="text-gray-500 dark:text-gray-400 mb-2">
                Próximo Partido
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {getInitials(
                      String(nextMatch?.user1.name),
                      String(nextMatch?.user1.lastname)
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {nextMatch?.user1.name} {nextMatch?.user1.lastname}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {nextMatch?.user1.position}°
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">vs</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {nextMatch?.shift === null
                      ? "Sin horario"
                      : formatDate(String(nextMatch?.shift.startHour))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {getInitials(
                      String(nextMatch?.user2.name),
                      String(nextMatch?.user2.lastname)
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {nextMatch?.user2.name} {nextMatch?.user2.lastname}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {nextMatch?.user2.position}°
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No hay próximos partidos asignados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrentTournament;
