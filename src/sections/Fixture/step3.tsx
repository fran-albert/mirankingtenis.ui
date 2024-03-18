// Step3.js
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Step3Props {
  onBack: () => void;
  onNext: () => void;
  idCategory: number;
  onMatchesSelect: (
    matches: { idUser1: number | null; idUser2: number | null }[]
  ) => void;
  players: User[];
}

export const Step3 = ({
  onBack,
  onNext,
  idCategory,
  onMatchesSelect,
  players,
}: Step3Props) => {
  const initialMatchesCount = Math.floor(players.length / 2);
  const [matches, setMatches] = useState(
    Array(initialMatchesCount).fill({ idUser1: null, idUser2: null })
  );

  // Ajusta los matches cada vez que cambia la cantidad de jugadores
  useEffect(() => {
    const matchesCount = Math.floor(players.length / 2);
    setMatches(Array(matchesCount).fill({ idUser1: null, idUser2: null }));
  }, [players.length]);

  const updateMatch = (
    matchIndex: any,
    playerPosition: any,
    playerId: string
  ) => {
    const newPlayerId = playerId !== "" ? Number(playerId) : null;
    const newPosition = playerPosition === "player1" ? "idUser1" : "idUser2";
    const newMatches = matches.map((match, index) =>
      index === matchIndex ? { ...match, [newPosition]: newPlayerId } : match
    );
    setMatches(newMatches);
  };

  const isPlayerSelectedElsewhere = (
    playerId: string,
    currentMatchIndex: number
  ) => {
    return matches.some((match, index) => {
      if (index !== currentMatchIndex) {
        return match.idUser1 === playerId || match.idUser2 === playerId;
      }
      return false;
    });
  };

  const handleNext = () => {
    onMatchesSelect(matches);
    onNext();
  };

  return (
    <div className="sm:px-6 md:px-8 lg:px-10">
      <p className="text-xl sm:text-2xl md:text-3xl text-center p-2">
        ¡Asigna los jugadores a los partidos!
      </p>
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-700">
              <tr className="text-left text-sm font-semibold text-white uppercase tracking-wider">
                <th className="py-4 px-6">Partido</th>
                <th className="py-4 px-6">LOCAL</th>
                <th className="py-4 px-6">VISITANTE</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {matches.map((match, index) => (
                <tr key={index}>
                  <td className="py-4 px-6">Partido {index + 1}</td>
                  <td className="py-4 px-6">
                    <Select
                      value={
                        match.idUser1 !== null ? String(match.idUser1) : ""
                      }
                      onValueChange={(value) =>
                        updateMatch(index, "player1", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players
                          .filter(
                            (player) =>
                              !isPlayerSelectedElsewhere(
                                String(player.id),
                                index
                              )
                          )
                          .map((player) => (
                            <SelectItem
                              key={player.id}
                              value={String(player.id)}
                            >
                              {player.lastname}, {player.name}{" "}
                              <span className="text-xs">
                                ({player.position}°)
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-6">
                    <Select
                      value={
                        match.idUser2 !== null ? String(match.idUser2) : ""
                      }
                      onValueChange={(value) =>
                        updateMatch(index, "player2", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players
                          .filter(
                            (player) =>
                              !isPlayerSelectedElsewhere(
                                String(player.id),
                                index
                              )
                          )
                          .map((player) => (
                            <SelectItem
                              key={player.id}
                              value={String(player.id)}
                            >
                              {player.lastname}, {player.name}{" "}
                              <span className="text-xs">
                                ({player.position}°)
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-slate-500 text-white mr-4 hover:bg-slate-700 transition-colors"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
