import { Button } from "@/components/ui/button";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
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
  const { registerPlayerToMatchMutation } = useDoubleMatchMutations();

  const handleRegister = () => {
    registerPlayerToMatchMutation.mutate(
      { matchId, body: { playerId, slot } },
      {
        onSuccess: (updatedMatch: any) => {
          // Accedemos dinámicamente al jugador usando `as keyof`
          const playerKey = `player${slot}` as keyof any;
          const updatedPlayer = updatedMatch[playerKey] as User | null; // Hacemos un type assertion

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
