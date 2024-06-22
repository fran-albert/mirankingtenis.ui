import { Button } from "@/components/ui/button";
import { createFixture } from "@/modules/fixture/application/create/createFixture";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import { TournamentRanking } from "@/modules/tournament-ranking/domain/TournamentRanking";
import { User } from "@/modules/users/domain/User";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { GroupRankingDto } from "@/common/types/group-ranking.dto";
import { useFixtureStore } from "@/hooks/useFixture";

interface Step2GroupProps {
  onBack: () => void;
  selectedCategoryId: number;
  tournamentCategoryId: number;
  selectedTournamentId: number;
  selectedJornada: string;
  selectedMatches: { idUser1: number | null; idUser2: number | null }[];
  groupRankings: GroupRankingDto[];
}

export const Step2Group = ({
  onBack,
  selectedCategoryId,
  selectedTournamentId,
  selectedJornada,
  tournamentCategoryId,
  selectedMatches,
  groupRankings,
}: Step2GroupProps) => {
  const { createFixtureGroup } = useFixtureStore();
  const router = useRouter();

  const handleSubmit = async () => {
    const groupMatches = groupRankings.map((group, groupIndex) => ({
      groupId: group.groupId,
      matches: selectedMatches
        .slice(groupIndex * 2, groupIndex * 2 + 2)
        .map((match) => ({
          idUser1: Number(match.idUser1),
          idUser2: Number(match.idUser2),
        })),
    }));
    const payload = {
      idTournamentCategory: tournamentCategoryId,
      jornada: Number(selectedJornada),
      groupMatches: groupMatches,
    };

    try {
      const fixtureCreationPromise = createFixtureGroup(
        selectedTournamentId,
        selectedCategoryId
      );
      console.log("Enviando datos a la API:", payload);
      toast.promise(fixtureCreationPromise, {
        loading: "Creando fixture...",
        success: "Fixture creado con éxito!",
        duration: 1000,
      });
      await fixtureCreationPromise;
      router.push("/partidos");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al crear el fixture";
        toast.error(`Error al crear el fixture: ${errorMessage}`, {
          duration: 1000,
        });
        console.error("Error al enviar los datos:", errorMessage);
      }
    }
  };

  return (
    <div className="sm:px-6 md:px-8 lg:px-10">
      <p className="text-xl sm:text-2xl md:text-3xl text-center p-2">
        Torneo {selectedTournamentId} - Categoría {selectedCategoryId} - Fecha{" "}
        {selectedJornada}
      </p>
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-700">
              <tr className="text-left text-sm font-semibold text-white uppercase tracking-wider">
                <th className="px-6 py-4 text-left font-medium uppercase tracking-wider">
                  Partido
                </th>
                <th className="px-6 py-4 text-left font-medium uppercase tracking-wider">
                  Jugador Local
                </th>
                <th className="px-6 py-4 text-left font-medium uppercase tracking-wider">
                  Jugador Visitante
                </th>
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
                  {selectedMatches
                    .slice(groupIndex * 2, groupIndex * 2 + 2)
                    .map((match, matchIndex) => {
                      const player1 = group.rankings.find(
                        (p) => p.userId === Number(match.idUser1)
                      );
                      const player2 = group.rankings.find(
                        (p) => p.userId === Number(match.idUser2)
                      );
                      return (
                        <tr key={matchIndex}>
                          <td className="py-6 px-4 whitespace-nowrap">
                            Partido {matchIndex + 1}
                          </td>
                          <td className="py-6 px-4 whitespace-nowrap">
                            {player1
                              ? `${player1.userName} (${player1.position}°)`
                              : "No asignado"}
                          </td>
                          <td className="py-6 px-4 whitespace-nowrap">
                            {player2
                              ? `${player2.userName} (${player2.position}°)`
                              : "No asignado"}
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
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-slate-500 text-white mr-4 hover:bg-slate-700 transition-colors"
        >
          Anterior
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};
