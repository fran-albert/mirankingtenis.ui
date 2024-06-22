import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { useEffect, useState } from "react";

interface TournamentSelectProps {
  selected?: string;
  onTournament?: (value: string) => void;
}

export const TournamentLeagueSelect = ({
  selected,
  onTournament,
}: TournamentSelectProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const tournamentRepository = createApiTournamentRepository();

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const allTournaments = await tournamentRepository.getAllTournaments();
        const tournamentLeague = allTournaments.filter(
          (tournament) => tournament.type === "league"
        );
        setTournaments(tournamentLeague);
      } catch (error) {
        console.error("Error al obtener los torneos:", error);
      }
    };

    loadTournaments();
  }, [tournamentRepository]);

  return (
    <Select value={selected} onValueChange={onTournament}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Torneos" />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((tournament) => (
          <SelectItem key={tournament.id} value={String(tournament.id)}>
            {tournament.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
