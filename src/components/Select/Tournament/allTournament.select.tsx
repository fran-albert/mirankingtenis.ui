import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentStore } from "@/hooks/useTournament";
import { useEffect } from "react";
import { Tournament } from "@/modules/tournament/domain/Tournament";

interface TournamentSelectProps {
  selected?: Tournament;
  onTournament?: (value: Tournament) => void;
  userId?: number;
}

export const TournamentSelect = ({
  selected,
  onTournament,
  userId,
}: TournamentSelectProps) => {
  const {
    getAllTournaments,
    getAllTournamentsByPlayer,
    allTournaments,
    loading,
  } = useTournamentStore();

  useEffect(() => {
    if (userId) {
      getAllTournamentsByPlayer(userId);
    } else {
      getAllTournaments();
    }
  }, [getAllTournaments, getAllTournamentsByPlayer, userId]);

  useEffect(() => {}, [allTournaments]);

  const handleValueChange = (value: string) => {
    const selectedTournament = allTournaments.find(
      (tournament) => String(tournament.id) === value
    );
    if (selectedTournament && onTournament) {
      onTournament(selectedTournament);
    }
  };

  return (
    <div className="w-full relative">
      <Select
        value={selected ? String(selected.id) : ""}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Torneos">
            {selected ? selected.name : "Torneos"}
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
