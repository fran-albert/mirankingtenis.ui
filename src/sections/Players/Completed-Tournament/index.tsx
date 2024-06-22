import { formatTournamentDates } from "@/common/helpers/helpers";
import { Separator } from "@/components/ui/separator";
import React from "react";

function CompletedTournament({
  completedTournaments,
}: {
  completedTournaments: any[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {completedTournaments.length > 0 ? (
        <div className="grid gap-4">
          {completedTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-bold">{tournament.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {formatTournamentDates(
                    tournament.startedAt,
                    tournament.finishedAt
                  )}
                </p>
              </div>
              <div>
                <p className="font-medium">Final</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {tournament.result
                    ? `Lost to ${tournament.result}`
                    : "No result"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No hay torneos completados.
        </p>
      )}
    </div>
  );
}

export default CompletedTournament;
