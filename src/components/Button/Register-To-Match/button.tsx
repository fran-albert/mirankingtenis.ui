import { Button } from "@/components/ui/button";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/User/User";

interface RegisterToMatchButtonProps {
  matchId: number;
  slot: number;
  playerId: number;
  setPlayers: (updatedPlayers: any) => void;
}

function RegisterToMatchButton({
  matchId,
  slot,
  playerId,
  setPlayers,
}: RegisterToMatchButtonProps) {
  const queryClient = useQueryClient();
  const { registerPlayerToMatchMutation } = useDoubleMatchMutations();

  const handleRegister = () => {
    registerPlayerToMatchMutation.mutate(
      { matchId, body: { playerId, slot } },
      {
        onSuccess: (updatedMatch: any) => {
          const playerKey = `player${slot}` as keyof any;
          const updatedPlayer = updatedMatch[playerKey] as User | null;

          if (
            updatedPlayer &&
            typeof updatedPlayer === "object" &&
            "id" in updatedPlayer
          ) {
            setPlayers((prevPlayers: any[]) =>
              prevPlayers.map((player, index) =>
                index + 1 === slot
                  ? {
                      id: updatedPlayer.id,
                      name: `${updatedPlayer.name} ${updatedPlayer.lastname}`,
                      category: player.category,
                    }
                  : player
              )
            );
          }

          // 🔥 Invalidamos y refetcheamos la consulta para actualizar `doubleMatch`
          queryClient.invalidateQueries({ queryKey: ["doubleMatch", matchId] });
        },
      }
    );
  };

  return (
    <div>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleRegister}
        disabled={registerPlayerToMatchMutation.isPending}
      >
        {registerPlayerToMatchMutation.isPending ? "Anotando..." : "Anotarme"}
      </Button>
    </div>
  );
}

export default RegisterToMatchButton;
