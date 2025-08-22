import { FixtureType } from "@/common/types/fixture-type.dto";
import { Button } from "@/components/ui/button";
import { useFixtureMutations } from "@/hooks/Fixture/useFixtureMutations";
import { TournamentParticipant } from "@/types/Tournament-Participant/TournamentParticipant";
import { TournamentRanking } from "@/types/Tournament-Ranking/TournamentRanking";
import { User } from "@/types/User/User";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Step5Props {
  onBack: () => void;
  selectedCategoryId: number;
  tournamentCategoryId: number;
  selectedTournamentId: number;
  selectedJornada: string;
  selectedMatches: { idUser1: number | null; idUser2: number | null }[];
  freePlayerIds: number[];
  players: TournamentRanking[];
}

export const Step5 = ({
  onBack,
  selectedCategoryId,
  selectedTournamentId,
  selectedJornada,
  tournamentCategoryId,
  selectedMatches,
  freePlayerIds,
  players,
}: Step5Props) => {
  const router = useRouter();
  const { createFixtureMutation } = useFixtureMutations();

  const handleSubmit = async () => {
    const payload = {
      idTournamentCategory: tournamentCategoryId,
      jornada: Number(selectedJornada),
      matches: selectedMatches.map((match) => ({
        idUser1: Number(match.idUser1),
        idUser2: Number(match.idUser2),
      })),
      type: FixtureType.LeagueStage,
      freePlayerIds: freePlayerIds,
    };

    try {
      await toast.promise(createFixtureMutation.mutateAsync(payload), {
        loading: "Creando fixture...",
        success: "Fixture creado con éxito!",
        error: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Error desconocido al crear el fixture";
          return `Error al crear el fixture: ${errorMessage}`;
        },
        duration: 1000,
      });
      router.push("/partidos");
    } catch (error: any) {
      console.error("Error al crear fixture:", error);
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
                <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider">
                  Jugador Local
                </th>
                <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider">
                  Jugador Visitante
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {selectedMatches.map((match, index) => {
                const player1 = players.find(
                  (p) => p.idPlayer === Number(match.idUser1)
                );
                const player2 = players.find(
                  (p) => p.idPlayer === Number(match.idUser2)
                );
                return (
                  <tr key={index}>
                    <td className="py-6 px-4 whitespace-nowrap">
                      Partido {index + 1}
                    </td>
                    <td className="py-6 px-4 whitespace-nowrap">
                      {player1
                        ? `${player1.lastname}, ${player1.name} (${player1.position}°)`
                        : "No asignado"}
                    </td>
                    <td className="py-6 px-4 whitespace-nowrap">
                      {player2
                        ? `${player2.lastname}, ${player2.name} (${player2.position}°)`
                        : "No asignado"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mostrar jugadores libres si los hay */}
      {freePlayerIds.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Jugadores que quedan libres esta fecha ({freePlayerIds.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {freePlayerIds.map((playerId) => {
              const player = players.find((p) => p.idPlayer === playerId);
              return player ? (
                <span
                  key={playerId}
                  className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm"
                >
                  {player.lastname}, {player.name} ({player.position}°)
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            Los jugadores libres no jugarán esta fecha y se registrará
            automáticamente en el sistema.
          </p>
        </div>
      )}

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
