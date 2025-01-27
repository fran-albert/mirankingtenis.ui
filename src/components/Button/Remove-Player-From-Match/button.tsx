import { Button } from "@/components/ui/button";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { User } from "@/types/User/User";

interface RemoveFromMatchButtonProps {
  matchId: number;
  playerId: number;
  setPlayers: (updatedPlayers: any) => void;
}

function RemovePlayerFromMatchButton({
  matchId,
  playerId,
  setPlayers,
}: RemoveFromMatchButtonProps) {
  const { removePlayerFromMatchMutation } = useDoubleMatchMutations();

  const handleRemove = () => {
    removePlayerFromMatchMutation.mutate(
      { matchId, playerId },
      {
        onSuccess: (response: string | DoublesExhibitionMatchResponse) => {
          if (typeof response === "string") {
            console.log("Player removed successfully:", response);
            return;
          }

          // Buscar en qué slot estaba el jugador
          const updatedPlayers = Object.keys(response)
            .filter((key) => key.startsWith("player"))
            .map(
              (key) =>
                response[
                  key as keyof DoublesExhibitionMatchResponse
                ] as User | null
            )
            .map((player, index) => ({
              id: player ? player.id : null,
              name: player ? `${player.name} ${player.lastname}` : null,
              category: `CAT ${index + 1}`,
            }));

          // Actualizar la lista de jugadores en la UI
          setPlayers(updatedPlayers);
        },
      }
    );
  };

  return (
    <div>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleRemove}
        disabled={removePlayerFromMatchMutation.isPending}
      >
        {removePlayerFromMatchMutation.isPending ? "Bajando..." : "Baja"}
      </Button>
    </div>
  );
}

export default RemovePlayerFromMatchButton;
