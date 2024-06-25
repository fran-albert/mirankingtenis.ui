import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ViewTournamentButton = ({
  playerId,
  tournamentId,
  path,
}: {
  playerId?: number;
  tournamentId?: number;
  path?: string;
}) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/${path}/${playerId}/torneos/${tournamentId}`);
  };

  return (
    <div className="flex justify-center">
      <Button size="sm" variant="slate" onClick={handleEdit}>
        Ver
      </Button>
    </div>
  );
};
