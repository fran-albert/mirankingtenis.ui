"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionIcon from "@/components/ui/actionIcon";
import { FaPowerOff } from "react-icons/fa6";
import { toast } from "sonner";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { createApiTournamentParticipantRepository } from "@/modules/tournament-participant/infra/ApiTournamentRepository";
import { desactivatePlayer } from "@/modules/tournament-participant/application/desactivate-player/desactivatePlayer";

interface DesactivatePlayerDialogProps {
  handlePlayerDesactivated?: (idPlayer: number) => void;
  idPlayer: number;
}

export default function DesactivatePlayerDialog({
  handlePlayerDesactivated,
  idPlayer,
}: DesactivatePlayerDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const tournamentParticipantRepository =
    createApiTournamentParticipantRepository();

  const handleConfirmDesactivate = async () => {
    try {
      const desactivatePlayerFn = desactivatePlayer(
        tournamentParticipantRepository
      );
      const playerDesactivatePromise = desactivatePlayerFn(idPlayer, 1);
      toast.promise(playerDesactivatePromise, {
        loading: "Desactivando jugador...",
        success: "Jugador eliminado del Torneo 1 con éxito!",
        error: "Error al eliminar el Jugador del Torneo 1",
        duration: 3000,
      });
      if (handlePlayerDesactivated) {
        handlePlayerDesactivated(idPlayer);
      }
    } catch (error) {
      console.error("Error al eliminar el Jugador del Torneo 1", error);
      toast.error("Error al eliminar el Jugador del Torneo 1");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={toggleDialog}>
          Desactivar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Abandono del jugador</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres quitar al jugador del Torneo?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDesactivate}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
