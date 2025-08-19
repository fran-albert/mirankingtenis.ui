import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllTournaments, useAllTournamentsByPlayer } from "@/hooks/Tournament/useTournament";
import { useEffect, useState } from "react";
import { Tournament } from "@/types/Tournament/Tournament";

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
  // Usar React Query hooks condicionalmente
  const { tournaments: allTournamentsData, isLoading: isAllTournamentsLoading } = useAllTournaments({ 
    enabled: !userId 
  });
  
  const { tournaments: playerTournamentsData, isLoading: isPlayerTournamentsLoading } = useAllTournamentsByPlayer({ 
    idPlayer: userId || 0,
    enabled: !!userId 
  });

  // Determinar qué datos usar
  const allTournaments = userId ? playerTournamentsData : allTournamentsData;
  const loading = userId ? isPlayerTournamentsLoading : isAllTournamentsLoading;

  const [initialSelection, setInitialSelection] = useState<
    Tournament | undefined
  >(undefined);

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
