import { Match } from "@/modules/match/domain/Match";
import React from "react";
import { FaEdit } from "react-icons/fa";

function MatchesDetails({ matches }: { matches: Match[] }) {
  return (
    <div className="flex sm:mx-auto">
      <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 bg-gray-100 p-2">
            Historial de Partidos
          </h3>
          <div className="space-y-4">
            {matches.map((match, index) => {
              const resultsString = match.sets
                .map((set, index) => {
                  const setLabel =
                    index === 2 ? "Super Tiebreak" : `Set ${index + 1}`;
                  return `${setLabel}: ${set.pointsPlayer1} - ${set.pointsPlayer2}`;
                })
                .join(", ");

              return (
                <div
                  key={index}
                  className="flex items-center justify-between
                  p-4 rounded-lg
                  hover:bg-gray-200
                  transition duration-300 ease-in-out"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">
                      {match.finalResult === "pending"
                        ? "Pendiente"
                        : match.finalResult}
                    </h3>
                    <p className="text-gray-600">Rival: {match.rivalName}</p>
                    <p className="text-gray-600">{resultsString}</p>{" "}
                    {/* Mostramos los resultados aquí */}
                  </div>
                  <div>
                    <FaEdit className="text-gray-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchesDetails;
