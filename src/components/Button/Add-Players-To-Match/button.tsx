import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDoubleMatch } from "@/hooks/Doubles-Express/useDoubleMatch";
import moment from "moment";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
import { useQueryClient } from "@tanstack/react-query";
import "moment/locale/es";
moment.locale("es");
interface Props {
  matchId: number;
  open: boolean;
  onClose: () => void;
  jugadoresDisponibles: { id: number; name: string; lastname: string }[];
  jugadores: number[];
  handleJugadorChange: (index: number, value: number) => void;
}

export const AddPlayersToMatchButton: React.FC<Props> = ({
  open,
  onClose,
  matchId,
  jugadoresDisponibles,
  jugadores,
  handleJugadorChange,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>(jugadores);
  const { doubleMatch } = useDoubleMatch({ auth: true, id: matchId });
  const { addPlayerToDoublesMatchesMutation } = useDoubleMatchMutations();
  useEffect(() => {
    if (!open) {
      setSelectedPlayers([0, 0, 0, 0]);
    }
  }, [open]);
  const queryClient = useQueryClient();
  const [initialPlayers, setInitialPlayers] = useState<number[]>([]);

  useEffect(() => {
    if (open && doubleMatch) {
      const initial = [
        doubleMatch.player1?.id || 0,
        doubleMatch.player2?.id || 0,
        doubleMatch.player3?.id || 0,
        doubleMatch.player4?.id || 0,
      ];
      setInitialPlayers(initial);
      setSelectedPlayers(initial);
    }
  }, [open, doubleMatch]);

  const handleReserve = () => {
    const playersToSend = selectedPlayers
      .map((playerId, index) => ({ playerId, slot: index + 1 }))
      .filter(
        (player) =>
          player.playerId !== 0 && !initialPlayers.includes(player.playerId)
      );

    if (playersToSend.length > 0) {
      const payload = { matchId, players: { players: playersToSend } };

      addPlayerToDoublesMatchesMutation.mutate(payload, {
        onSuccess: (updatedMatch) => {
          setSelectedPlayers([
            updatedMatch.player1Id || 0,
            updatedMatch.player2Id || 0,
            updatedMatch.player3Id || 0,
            updatedMatch.player4Id || 0,
          ]);

          queryClient.refetchQueries({ queryKey: ["doubleMatch", matchId] });

          onClose();
        },
      });
    }
  };

  const getAvailablePlayers = (index: number) => {
    return jugadoresDisponibles.filter(
      (jugador) =>
        !selectedPlayers.some((id, i) => id === jugador.id && i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Partido Dobles Express</DialogTitle>
          <DialogDescription>
            Selecciona los jugadores para el partido (opcional).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex justify-between items-center w-full">
            <Label htmlFor="fecha-hora" className="text-left">
              {moment(doubleMatch?.shift.startHour).format("LL")} -{" "}
              {moment(doubleMatch?.shift.startHour).format("HH:mm")}
            </Label>
            <Label htmlFor="court" className="text-right">
              Cancha {doubleMatch?.shift.court.name}
            </Label>
          </div>

          {[0, 1, 2, 3].map((index) => {
            const isDisabled = index === 0;
            const currentPlayer =
              index === 0
                ? doubleMatch?.player1
                : index === 1
                ? doubleMatch?.player2
                : index === 2
                ? doubleMatch?.player3
                : doubleMatch?.player4;

            return (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`jugador-${index + 1}`} className="text-right">
                  Jugador {index + 1}
                </Label>
                <Select
                  onValueChange={(value) => {
                    const newPlayers = [...selectedPlayers];
                    newPlayers[index] = Number(value);
                    setSelectedPlayers(newPlayers);
                    handleJugadorChange(index, Number(value));
                  }}
                  value={
                    selectedPlayers[index] ? String(selectedPlayers[index]) : ""
                  }
                  disabled={isDisabled}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue
                      placeholder={
                        index === 0 && currentPlayer
                          ? `${currentPlayer.lastname}, ${currentPlayer.name}`
                          : "Seleccionar jugador"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {getAvailablePlayers(index).map((jugador) => (
                      <SelectItem
                        key={jugador.id}
                        value={jugador.id.toString()}
                      >
                        {jugador.lastname}, {jugador.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              handleReserve();
              onClose();
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
