import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgeLost } from "@/components/Badge/Lost/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";
import { Match } from "@/modules/match/domain/Match";
import React from "react";

function MatchesDetails({
  matches,
  currentUser,
}: {
  matches: Match[];
  currentUser: string | undefined;
}) {
  console.log(matches)
  return (
    <div className="flex sm:mx-auto">
      <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 bg-gray-100 p-2">
          Historial de Partidos
        </h3>
        <div className="space-y-4">
          {matches.map((match, index) => {
            const isCurrentUserTheWinner = match.winner === currentUser;
            const isPending = match.status === "pending";
            return (
              <div
                key={match.id}
                className="flex flex-col items-start justify-between
                p-2 rounded-lg"
              >
                <h3
                  className={`text-xl font-bold ${
                    isCurrentUserTheWinner ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPending ? (
                    <BadgePending text="Pendiente" />
                  ) : isCurrentUserTheWinner ? (
                    <BadgeWin text="Victoria" />
                  ) : (
                    <BadgeLost text="Derrota" />
                  )}
                </h3>
                <p className="text-gray-600">Rival: {match.rivalName}</p>
                {!isPending && (
                  <p className="text-gray-600">
                    {match.sets
                      .map((set, idx) => {
                        const isCurrentUserPlayer1 =
                          match.user1Name === currentUser;
                        const pointsFirst = isCurrentUserPlayer1
                          ? set.pointsPlayer1
                          : set.pointsPlayer2;
                        const pointsSecond = isCurrentUserPlayer1
                          ? set.pointsPlayer2
                          : set.pointsPlayer1;
                        return `${pointsFirst}-${pointsSecond}${
                          idx < match.sets.length - 1 ? ", " : ""
                        }`;
                      })
                      .join("")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MatchesDetails;
