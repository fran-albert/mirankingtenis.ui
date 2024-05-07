import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/modules/category/domain/Category";
import { CategoryRepository } from "@/modules/category/domain/CategoryRepository";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { useEffect, useState } from "react";

interface TournamentSelectProps {
  selected?: string;
  onTournament?: (value: string) => void;
  className?: string;
}

export const TournamentSelect = ({
  selected,
  onTournament,
  className,
}: TournamentSelectProps) => {
  const [tournament, setTournament] = useState<Tournament[]>([]);
  const tournamentRepository = createApiTournamentRepository();

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const tournaments = await tournamentRepository.getAllTournaments();
        setTournament(tournaments);
      } catch (error) {
        console.error("Error al obtener los torneos:", error);
      }
    };

    loadTournaments();
  }, [tournamentRepository]);

  return (
    <Select value={selected} onValueChange={onTournament}>
      <SelectTrigger
        className={`w-full ${
          className ? className : "bg-gray-200 border-gray-300 text-gray-800"
        }`}
      >
        <SelectValue placeholder="Seleccione el torneo..." />
      </SelectTrigger>
      <SelectContent>
        {tournament.map((tournament) => (
          <SelectItem key={tournament.id} value={String(tournament.id)}>
            {tournament.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
