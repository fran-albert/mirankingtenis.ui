import { formatTournamentDates } from "@/common/helpers/helpers";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ViewTournamentButton } from "@/components/Button/ViewTournament/button";
function CompletedTournament({
  completedTournaments,
  idPlayer,
}: {
  completedTournaments: any[];
  idPlayer: number;
}) {
  return (
    <div>
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Torneos Jugados</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {completedTournaments.length > 0 ? (
            <div className="grid gap-4">
              {completedTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold">{tournament.name}</h3>
                    <p className="text-gray-500 x">
                      {formatTournamentDates(
                        tournament.startedAt,
                        tournament.finishedAt
                      )}
                    </p>
                  </div>
                  <div>
                    <ViewTournamentButton
                      tournamentId={tournament.id}
                      path="jugadores"
                      playerId={idPlayer}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 ">
              No hay torneos completados.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CompletedTournament;
