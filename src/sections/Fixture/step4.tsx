// Step3.js
import { User } from "@/types/User/User";
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
import { TournamentParticipant } from "@/types/Tournament-Participant/TournamentParticipant";
import { TournamentRanking } from "@/types/Tournament-Ranking/TournamentRanking";

interface Step4Props {
  onNext: () => void;
  idCategory: number;
  onMatchesSelect: (
    matches: { idUser1: number | null; idUser2: number | null }[]
  ) => void;
  onFreePlayersSelect: (freePlayerIds: number[]) => void;
  players: TournamentRanking[];
}

export const Step4 = ({
  onNext,
  idCategory,
  onMatchesSelect,
  onFreePlayersSelect,
  players,
}: Step4Props) => {
  const [matches, setMatches] = useState<{ idUser1: number | null; idUser2: number | null }[]>([]);

  const addMatch = () => {
    setMatches([...matches, { idUser1: null, idUser2: null }]);
  };

  const removeMatch = (matchIndex: number) => {
    setMatches(matches.filter((_, index) => index !== matchIndex));
  };

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
    currentMatchIndex: number,
    playerPosition: string
  ) => {
    const playerNumId = Number(playerId);
    return matches.some((match, index) => {
      if (index !== currentMatchIndex) {
        return match.idUser1 === playerNumId || match.idUser2 === playerNumId;
      } else if (index === currentMatchIndex) {
        if (playerPosition === "player1" && match.idUser2 === playerNumId) {
          return true;
        } else if (
          playerPosition === "player2" &&
          match.idUser1 === playerNumId
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const handleNext = () => {

    // Filtrar solo los partidos que tienen ambos jugadores asignados
    const validMatches = matches.filter(match => match.idUser1 !== null && match.idUser2 !== null);
    
    // Obtener IDs de jugadores asignados a partidos válidos
    const assignedPlayerIds = validMatches.reduce((ids: number[], match) => {
      if (match.idUser1) ids.push(match.idUser1);
      if (match.idUser2) ids.push(match.idUser2);
      return ids;
    }, []);

    // Encontrar jugadores libres (no asignados a ningún partido)
    const freePlayerIds = players
      .filter(player => !assignedPlayerIds.includes(player.idPlayer))
      .map(player => player.idPlayer);

    onMatchesSelect(validMatches);

    onFreePlayersSelect(freePlayerIds);
    onNext();
  };

  // Calcular jugadores libres para mostrar en tiempo real
  const assignedPlayerIds = matches.reduce((ids: number[], match) => {
    if (match.idUser1) ids.push(match.idUser1);
    if (match.idUser2) ids.push(match.idUser2);
    return ids;
  }, []);

  const freePlayers = players.filter(player => !assignedPlayerIds.includes(player.idPlayer));

  return (
    <div className="sm:px-6 md:px-8 lg:px-10">
      <p className="text-xl sm:text-2xl md:text-3xl text-center p-2">
        ¡Asigna los jugadores a los partidos!
      </p>

      {/* Información y controles */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-800 font-semibold">
              Partidos válidos: {validMatches.length} / {maxPossibleMatches} posibles
            </p>
            <p className="text-blue-600 text-sm">
              Total de jugadores: {players.length} | Jugadores libres: {freePlayers.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addMatch}
              disabled={matches.length >= maxPossibleMatches}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              + Agregar Partido
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mostrar jugadores libres si los hay */}
      {freePlayers.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Jugadores Libres esta fecha ({freePlayers.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {freePlayers.map(player => (
              <span key={player.idPlayer} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                {player.lastname}, {player.name} ({player.position}°)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-700">
              <tr className="text-left text-sm font-semibold text-white uppercase tracking-wider">
                <th className="py-4 px-6">Partido</th>
                <th className="py-4 px-6">LOCAL</th>
                <th className="py-4 px-6">VISITANTE</th>
                <th className="py-4 px-6">Acciones</th>
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
                                String(player.idPlayer),
                                index,
                                "player1"
                              )
                          )
                          .map((player) => (
                            <SelectItem
                              key={player.idPlayer}
                              value={String(player.idPlayer)}
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
                                String(player.idPlayer),
                                index,
                                "player2"
                              )
                          )
                          .map((player) => (
                            <SelectItem
                              key={player.idPlayer}
                              value={String(player.idPlayer)}
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
                    <Button
                      onClick={() => removeMatch(index)}
                      className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {matches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No hay partidos agregados. Haz clic en &quot;Agregar Partido&quot; para comenzar.
          </p>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button
          onClick={handleNext}
          disabled={validMatches.length === 0}
          className="px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente ({validMatches.length} partidos válidos)
        </Button>
      </div>
    </div>
  );
};
