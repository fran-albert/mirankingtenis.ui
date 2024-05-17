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
import { Tournament } from "@/modules/tournament/domain/Tournament";

interface FinishTournamentDialogDialogProps {
  handlePlayerDesactivated?: (idTournament: number) => void;
  tournament: Tournament;
}

export default function FinishTournamentDialog({
  handlePlayerDesactivated,
  tournament,
}: FinishTournamentDialogDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const tournamentParticipantRepository =
    createApiTournamentParticipantRepository();

  const handleConfirmDesactivate = async () => {
    try {
      const desactivatePlayerFn = desactivatePlayer(
        tournamentParticipantRepository
      );
      const playerDesactivatePromise = desactivatePlayerFn(tournament.id, 1);
      toast.promise(playerDesactivatePromise, {
        loading: "Desactivando jugador...",
        success: "Jugador eliminado del Torneo 1 con éxito!",
        error: "Error al eliminar el Jugador del Torneo 1",
        duration: 3000,
      });
      if (handlePlayerDesactivated) {
        handlePlayerDesactivated(tournament.id);
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
        <Button size="sm" className="bg-red-700 hover:bg-red-900" onClick={toggleDialog}>
          Finalizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Torneo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-900">
          ¿Estás seguro de que quieres finalizar el torneo
          <span className="font-bold"> "{tournament.name}"</span>?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="green" onClick={handleConfirmDesactivate}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
