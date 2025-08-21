import React from "react";
import { User } from "@/types/User/User";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tournament } from "@/types/Tournament/Tournament";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  tournament: Tournament | null;
  selectedPlayers: User[];
  playerPositions: {
    playerId: number;
    position: string | null;
    isDirectlyQualified: boolean;
  }[];
}

export const Step4 = ({
  onNext,
  tournament,
  onBack,
  selectedPlayers,
  playerPositions,
}: Step4Props) => {
  const getPlayerPosition = (playerId: number) => {
    return playerPositions.find((p) => p.playerId === playerId)?.position || "";
  };

  const isPlayerDirectlyQualified = (playerId: number) => {
    return playerPositions.find((p) => p.playerId === playerId)?.isDirectlyQualified || false;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
        <p className="text-lg text-center sm:text-2xl md:text-3xl mb-6">
          Confirmar Posiciones Iniciales
        </p>
        <table className="w-full mt-2 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-center font-medium">Jugador</th>
              <th className="px-4 py-3 text-center font-medium">
                Posición Inicial
              </th>
              {tournament?.type === "master" && (
                <th className="px-4 py-3 font-medium">
                  Clasificado a Playoffs
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {selectedPlayers.map((player) => (
              <tr key={player.id} className="border-b">
                <td className="px-4 py-3">
                  <Label className=" text-slate-800">
                    {player.lastname}, {player.name}
                  </Label>
                </td>
                <td className="px-4 py-3">
                  <Label className=" text-slate-800">
                    {getPlayerPosition(player.id)}
                  </Label>
                </td>
                {tournament?.type === "master" && (
                  <td className="px-4 py-3">
                    <Label className=" text-slate-800">
                      {isPlayerDirectlyQualified(player.id) ? "Sí" : "No"}
                    </Label>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-6">
          <Button
            onClick={onBack}
            className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
          >
            Anterior
          </Button>
          <Button
            onClick={onNext}
            className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
