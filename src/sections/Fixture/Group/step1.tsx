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
import { TournamentRanking } from "@/types/Tournament-Ranking/TournamentRanking";
import { GroupRankingDto } from "@/common/types/group-ranking.dto";

interface Step1GroupsProps {
  onNext: () => void;
  idCategory: number;
  onMatchesSelect: (
    matches: { idUser1: number | null; idUser2: number | null }[]
  ) => void;
  groupRankings: GroupRankingDto[];
}

export const Step1Groups = ({
  onNext,
  idCategory,
  onMatchesSelect,
  groupRankings,
}: Step1GroupsProps) => {
  const initialMatchesCount = groupRankings.length * 2; // 2 partidos por grupo
  const [matches, setMatches] = useState(
    Array(initialMatchesCount).fill({ idUser1: null, idUser2: null })
  );

  useEffect(() => {
    setMatches(
      Array(initialMatchesCount).fill({ idUser1: null, idUser2: null })
    );
  }, [groupRankings, initialMatchesCount]);

  const updateMatch = (
    matchIndex: number,
    playerPosition: "player1" | "player2",
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
    playerPosition: "player1" | "player2"
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
              {groupRankings.map((group, groupIndex) => (
                <React.Fragment key={group.groupId}>
                  <tr>
                    <td colSpan={3} className="bg-gray-200 text-center py-2">
                      Grupo {group.groupName}
                    </td>
                  </tr>
                  {Array(2)
                    .fill(null)
                    .map((_, matchIndex) => {
                      const match = matches[groupIndex * 2 + matchIndex] || {
                        idUser1: null,
                        idUser2: null,
                      };
                      return (
                        <tr key={`${group.groupId}-${matchIndex}`}>
                          <td className="py-4 px-6">
                            Partido {matchIndex + 1}
                          </td>
                          <td className="py-4 px-6">
                            <Select
                              value={
                                match.idUser1 !== null
                                  ? String(match.idUser1)
                                  : ""
                              }
                              onValueChange={(value) =>
                                updateMatch(
                                  groupIndex * 2 + matchIndex,
                                  "player1",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione jugador" />
                              </SelectTrigger>
                              <SelectContent>
                                {group.rankings
                                  .filter(
                                    (p) =>
                                      !isPlayerSelectedElsewhere(
                                        String(p.userId),
                                        groupIndex * 2 + matchIndex,
                                        "player1"
                                      )
                                  )
                                  .map((p) => (
                                    <SelectItem
                                      key={p.userId}
                                      value={String(p.userId)}
                                    >
                                      {p.userName}{" "}
                                      <span className="text-xs">
                                        ({p.position}°)
                                      </span>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-6">
                            <Select
                              value={
                                match.idUser2 !== null
                                  ? String(match.idUser2)
                                  : ""
                              }
                              onValueChange={(value) =>
                                updateMatch(
                                  groupIndex * 2 + matchIndex,
                                  "player2",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione jugador" />
                              </SelectTrigger>
                              <SelectContent>
                                {group.rankings
                                  .filter(
                                    (p) =>
                                      !isPlayerSelectedElsewhere(
                                        String(p.userId),
                                        groupIndex * 2 + matchIndex,
                                        "player2"
                                      )
                                  )
                                  .map((p) => (
                                    <SelectItem
                                      key={p.userId}
                                      value={String(p.userId)}
                                    >
                                      {p.userName}{" "}
                                      <span className="text-xs">
                                        ({p.position}°)
                                      </span>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={handleNext}
          className="px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 transition-colors"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
