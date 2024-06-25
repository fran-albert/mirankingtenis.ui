import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentStore } from "@/hooks/useTournament";
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
  const { getAllTournaments, tournaments } = useTournamentStore();

  useEffect(() => {
    getAllTournaments();
  }, [getAllTournaments]);

  const tournamentLeague = tournaments.filter(
    (tournament) => tournament.type === "league"
  );

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
