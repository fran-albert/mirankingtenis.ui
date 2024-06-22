import React from "react";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Step5Props {
  onSubmit: () => void;
  onBack: () => void;
  selectedPlayers: User[];
  playerPositions: { playerId: number; position: string }[];
  tournamentId: number;
  categoryId: number;
}

export const Step5 = ({
  onSubmit,
  onBack,
  selectedPlayers,
  tournamentId,
  categoryId,
  playerPositions,
}: Step5Props) => {
  const getPlayerPosition = (playerId: number) => {
    return playerPositions.find((p) => p.playerId === playerId)?.position || "";
  };
  const getCategoryName = (categoryId: number) => {
    switch (categoryId) {
      case 1:
        return "A";
      case 2:
        return "B";
      case 3:
        return "C";
      default:
        return "Desconocido";
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
          <p className="text-lg text-center sm:text-2xl md:text-3xl mb-6">
            Confirmar Datos del Torneo
          </p>
          <div className="flex justify-around text-slate-700 font-semibold">
            <h2 className="text-xl mb-4">Torneo ID: {tournamentId}</h2>
            <h2 className="text-xl mb-4">
              Categoría: {getCategoryName(categoryId)}
            </h2>
          </div>
          <table className="w-full mt-2 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-center font-medium">Jugador</th>
                <th className="px-4 py-3 text-center font-medium">
                  Posición Inicial
                </th>
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
              onClick={onSubmit}
              className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
