import React, { useState } from "react";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  selectedPlayers: User[];
  onPlayerPositionsChange: (
    positions: { playerId: number; position: string }[]
  ) => void;
}

export const Step3 = ({
  onNext,
  onBack,
  selectedPlayers,
  onPlayerPositionsChange,
}: Step3Props) => {
  const [playerPositions, setPlayerPositions] = useState<
    { playerId: number; position: string }[]
  >(selectedPlayers.map((player) => ({ playerId: player.id, position: "" })));

  const handlePositionChange = (playerId: number, position: string) => {
    setPlayerPositions(
      playerPositions.map((player) =>
        player.playerId === playerId ? { ...player, position } : player
      )
    );
  };

  const handleSubmit = () => {
    // Validar y enviar las posiciones
    onPlayerPositionsChange(playerPositions);
    onNext();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
        <p className="text-lg text-center sm:text-2xl md:text-3xl mb-6">
          Asignar Posiciones Iniciales
        </p>
        <table className="w-full mt-2 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 font-medium">Jugador</th>
              <th className="px-4 py-3 font-medium">Posición Inicial</th>
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
                  <Input
                    type="number"
                    className="w-full"
                    value={
                      playerPositions.find((p) => p.playerId === player.id)
                        ?.position || ""
                    }
                    onChange={(e) =>
                      handlePositionChange(player.id, e.target.value)
                    }
                  />
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
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
