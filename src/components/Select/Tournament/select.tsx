import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllTournaments } from "@/hooks/Tournament/useTournament";

interface TournamentSelectProps {
  selected?: string;
  onTournament?: (value: string) => void;
}

export const TournamentLeagueSelect = ({
  selected,
  onTournament,
}: TournamentSelectProps) => {
  // Usar React Query hook
  const { tournaments } = useAllTournaments();

  // Ya no es necesario useEffect - React Query maneja la carga automáticamente

  const tournamentLeague = tournaments?.filter(
    (tournament) => tournament.type === "league"
  ) || [];

  return (
    <Select value={selected} onValueChange={onTournament}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Torneos" />
      </SelectTrigger>
      <SelectContent>
        {tournamentLeague.map((tournament) => (
          <SelectItem key={tournament.id} value={String(tournament.id)}>
            {tournament.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
