import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentStore } from "@/hooks/useTournament";
import { useEffect, useState } from "react";
import { Tournament } from "@/modules/tournament/domain/Tournament";

interface TournamentSelectProps {
  selected?: Tournament;
  onTournament?: (value: Tournament) => void;
  userId?: number;
  currentTournamentByPlayer?: Tournament | null;
  lastTournament?: Tournament | null;
}

export const TournamentSelect = ({
  selected,
  onTournament,
  userId,
  currentTournamentByPlayer,
  lastTournament,
}: TournamentSelectProps) => {
  const {
    getAllTournaments,
    getAllTournamentsByPlayer,
    allTournaments,
    loading,
  } = useTournamentStore();
  const [initialSelection, setInitialSelection] = useState<
    Tournament | undefined
  >(undefined);

  useEffect(() => {
    if (userId) {
      getAllTournamentsByPlayer(userId);
    } else {
      getAllTournaments();
    }
  }, [getAllTournaments, getAllTournamentsByPlayer, userId]);

  useEffect(() => {
    if (!selected) {
      if (currentTournamentByPlayer) {
        setInitialSelection(currentTournamentByPlayer);
      } else if (lastTournament) {
        setInitialSelection(lastTournament);
      }
    }
  }, [currentTournamentByPlayer, lastTournament, selected]);

  useEffect(() => {
    if (initialSelection && onTournament && !selected) {
      onTournament(initialSelection);
    }
  }, [initialSelection, onTournament, selected]);

  const handleValueChange = (value: string) => {
    const selectedTournament = allTournaments.find(
      (tournament) => String(tournament.id) === value
    );
    if (selectedTournament && onTournament) {
      onTournament(selectedTournament);
    }
  };

  const displayValue = selected
    ? String(selected.id)
    : initialSelection
    ? String(initialSelection.id)
    : "";

  const displayName = selected
    ? selected.name
    : initialSelection
    ? initialSelection.name
    : "Torneos";

  return (
    <div className="w-full relative">
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Torneos">
            {displayName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {allTournaments.map((tournament) => (
            <SelectItem key={tournament.id} value={String(tournament.id)}>
              {tournament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
