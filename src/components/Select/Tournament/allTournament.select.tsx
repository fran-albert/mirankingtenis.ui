import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentStore } from "@/hooks/useTournament";
import { useEffect } from "react";

interface TournamentSelectProps {
  selected?: string;
  onTournament?: (value: string) => void;
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

  return (
    <div className="w-full relative">
      <Select value={selected} onValueChange={onTournament}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Torneos" />
        </SelectTrigger>
        <SelectContent className="">
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
