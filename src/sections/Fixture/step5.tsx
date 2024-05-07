import { Button } from "@/components/ui/button";
import { createFixture } from "@/modules/fixture/application/create/createFixture";
import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import { User } from "@/modules/users/domain/User";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Step5Props {
  onBack: () => void;
  onSubmit: () => void;
  selectedCategoryId: number;
  selectedTournamentId: number;
  selectedJornada: string;
  selectedMatches: { idUser1: number | null; idUser2: number | null }[];
  players: User[];
}

export const Step5 = ({
  onBack,
  onSubmit,
  selectedCategoryId,
  selectedTournamentId,
  selectedJornada,
  selectedMatches,
  players,
}: Step5Props) => {
  const fixtureRepository = createApiFixtureRepository();
  const createFixtureFn = createFixture(fixtureRepository);
  const router = useRouter();

  const handleSubmit = async () => {
    const payload = {
      idTournament: selectedTournamentId,
      idCategory: selectedCategoryId,
      jornada: Number(selectedJornada),
      matches: selectedMatches.map((match) => ({
        idUser1: Number(match.idUser1),
        idUser2: Number(match.idUser2),
      })),
    };

    try {
      const fixtureCreationPromise = createFixtureFn(payload);
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
                  (p) => p.id === Number(match.idUser1)
                );
                const player2 = players.find(
                  (p) => p.id === Number(match.idUser2)
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
